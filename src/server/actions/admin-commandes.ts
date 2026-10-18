"use server";

import { refresh, updateTag } from "next/cache";
import { exigerAdmin } from "@/lib/admin/serveur";
import {
  erreursParChamp,
  estRemboursable,
  etapeSuivante,
  saisieBrute,
  schemaExpedition,
  type EtatFormulaireAdmin,
} from "@/lib/admin/regles";
import { envoyerEmailSuivi } from "@/lib/commandes/emails";
import { db } from "@/lib/db";
import { paiementConfigure, stripe } from "@/lib/stripe";
import type { OrderStatus } from "@/generated/prisma/enums";

const horodatage: Partial<Record<OrderStatus, "preparedAt" | "shippedAt" | "deliveredAt">> = {
  PREPARING: "preparedAt",
  SHIPPED: "shippedAt",
  DELIVERED: "deliveredAt",
};

/**
 * Fait passer une commande à l'étape suivante. Le statut attendu est envoyé par le formulaire :
 * si un autre admin l'a déjà avancée, la mise à jour ne trouve rien et rien n'est fait deux fois.
 */
export async function avancerCommande(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  const numero = String(formulaire.get("numero"));
  const admin = await exigerAdmin(`/admin/commandes/${numero}`);
  const depuis = String(formulaire.get("depuis")) as OrderStatus;
  const vers = etapeSuivante[depuis];
  if (!vers) return { message: "Cette commande n'a plus d'étape à franchir." };

  let suivi = {};
  if (vers === "SHIPPED") {
    const saisie = schemaExpedition.safeParse(Object.fromEntries(formulaire));
    if (!saisie.success) {
      return {
        message: "Certains champs sont à corriger.",
        erreurs: erreursParChamp(saisie.error),
        valeurs: saisieBrute(formulaire),
      };
    }
    suivi = {
      carrier: saisie.data.transporteur,
      trackingNumber: saisie.data.numeroSuivi,
      trackingUrl: saisie.data.lienSuivi,
    };
  }

  const commande = await db.order.findUnique({ where: { number: numero }, select: { id: true } });
  if (!commande) return { message: "Commande introuvable." };
  const { count } = await db.order.updateMany({
    where: { id: commande.id, status: depuis },
    data: { status: vers, [horodatage[vers]!]: new Date(), ...suivi },
  });
  if (count === 0) return { message: "La commande a changé entre-temps : rechargez la page." };
  await db.orderEvent.create({ data: { orderId: commande.id, status: vers, actorId: admin.id } });

  if (vers === "SHIPPED") await envoyerEmailSuivi(commande.id, "expedition");
  refresh();
  return null;
}

/**
 * Remboursement intégral par Stripe. Les montres reviennent en stock seulement si elles en
 * étaient sorties (commande passée par « payée ») et si l'admin le demande.
 */
export async function rembourserCommande(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  const numero = String(formulaire.get("numero"));
  const admin = await exigerAdmin(`/admin/commandes/${numero}`);
  const commande = await db.order.findUnique({
    where: { number: numero },
    select: {
      id: true,
      status: true,
      paidAt: true,
      stripePaymentIntentId: true,
      items: { select: { productId: true, quantity: true } },
    },
  });
  if (!commande || !estRemboursable(commande.status, commande.stripePaymentIntentId)) {
    return { message: "Cette commande ne peut pas être remboursée." };
  }
  if (!paiementConfigure) {
    return {
      message:
        "Stripe n'est pas configuré sur ce site (clés de test absentes) : aucun remboursement ne peut partir.",
    };
  }

  try {
    await stripe().refunds.create(
      { payment_intent: commande.stripePaymentIntentId! },
      { idempotencyKey: `remboursement-${commande.id}` },
    );
  } catch (erreur) {
    console.error(`Remboursement refusé pour la commande ${numero}`, erreur);
    return { message: "Stripe a refusé le remboursement. Vérifiez le paiement dans Stripe." };
  }

  const remettreEnStock = formulaire.get("restock") === "on" && commande.paidAt !== null;
  await db.$transaction([
    db.order.update({
      where: { id: commande.id },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
        events: {
          create: {
            status: "REFUNDED",
            actorId: admin.id,
            note: remettreEnStock ? "Montres remises en stock" : null,
          },
        },
      },
    }),
    ...(remettreEnStock
      ? commande.items
          .filter((i) => i.productId)
          .map((i) =>
            db.product.update({
              where: { id: i.productId! },
              data: { stock: { increment: i.quantity } },
            }),
          )
      : []),
  ]);

  if (remettreEnStock) updateTag("catalogue");
  await envoyerEmailSuivi(commande.id, "remboursement");
  refresh();
  return null;
}
