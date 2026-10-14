// Traitement des événements Stripe : c'est ici, et seulement ici, qu'une commande devient payée,
// que le stock baisse et qu'une facture reçoit son numéro.
import "server-only";
import type Stripe from "stripe";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { adresseDepuisStripe } from "./adresse";
import { numeroFacture } from "./numeros";

/** Clé du verrou PostgreSQL qui sérialise l'attribution des numéros de facture. */
const VERROU_FACTURES = 734_201;

export type IssuePaiement =
  | { type: "payee"; commandeId: string }
  | { type: "rupture"; commandeId: string }
  | { type: "annulee"; commandeId: string }
  | { type: "ignore"; raison: string };

class RuptureDeStock extends Error {}

/**
 * Seul un doublon sur l'identifiant de l'événement veut dire « déjà traité ». Toute autre
 * contrainte d'unicité violée est une vraie erreur : la taire répondrait 200 à Stripe,
 * qui ne renverrait jamais un paiement pourtant perdu.
 */
async function dejaTraite(evenement: Stripe.Event, erreur: unknown) {
  if (!(erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002")) {
    return false;
  }
  return (await db.stripeEvent.count({ where: { id: evenement.id } })) > 0;
}

/**
 * Applique un événement Stripe. Stripe peut livrer un même événement plusieurs fois :
 * l'identifiant de l'événement est enregistré dans la même transaction que ses effets,
 * si bien qu'un second passage ne change rien.
 */
export async function traiterEvenementStripe(evenement: Stripe.Event): Promise<IssuePaiement> {
  try {
    switch (evenement.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = evenement.data.object;
        // Certains moyens de paiement confirment plus tard : on attend alors async_payment_succeeded.
        if (session.payment_status !== "paid") {
          return { type: "ignore", raison: "paiement pas encore confirmé" };
        }
        return await confirmerPaiement(evenement, session);
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        return await annulerCommande(evenement, evenement.data.object);
      default:
        return { type: "ignore", raison: `événement non suivi : ${evenement.type}` };
    }
  } catch (erreur) {
    if (await dejaTraite(evenement, erreur)) {
      return { type: "ignore", raison: "événement déjà traité" };
    }
    throw erreur;
  }
}

async function confirmerPaiement(
  evenement: Stripe.Event,
  session: Stripe.Checkout.Session,
): Promise<IssuePaiement> {
  const commandeId = session.metadata?.commandeId;
  if (!commandeId) return { type: "ignore", raison: "session sans commande" };

  const client = session.customer_details;
  const livraison = session.collected_information?.shipping_details;
  const facturation = adresseDepuisStripe(client?.name, client?.address, client?.phone);
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  try {
    return await db.$transaction(async (tx) => {
      await tx.stripeEvent.create({ data: { id: evenement.id, type: evenement.type } });

      const commande = await tx.order.findUnique({
        where: { id: commandeId },
        select: { id: true, status: true, items: { select: { productId: true, quantity: true } } },
      });
      if (!commande) return { type: "ignore", raison: "commande introuvable" } as const;
      if (commande.status !== "PENDING") {
        return { type: "ignore", raison: `commande déjà ${commande.status}` } as const;
      }

      // Décrément conditionnel : la ligne n'est modifiée que s'il reste assez de pièces.
      // Si deux clients ont payé la dernière pièce, le second tombe ici.
      for (const { productId, quantity } of commande.items) {
        if (!productId) throw new RuptureDeStock();
        const { count } = await tx.product.updateMany({
          where: { id: productId, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (count === 0) throw new RuptureDeStock();
      }

      // Numéro de facture continu : le verrou empêche deux paiements simultanés de prendre
      // le même numéro, et la transaction garantit qu'un échec ne laisse pas de trou.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${VERROU_FACTURES})`;
      const { _max } = await tx.invoice.aggregate({ _max: { sequence: true } });
      const sequence = (_max.sequence ?? 0) + 1;
      const maintenant = new Date();

      await tx.invoice.create({
        data: {
          orderId: commande.id,
          sequence,
          number: numeroFacture(maintenant.getFullYear(), sequence),
          issuedAt: maintenant,
        },
      });

      await tx.order.update({
        where: { id: commande.id },
        data: {
          status: "PAID",
          paidAt: maintenant,
          email: client?.email ?? null,
          billingAddress: facturation ?? Prisma.DbNull,
          shippingAddress:
            adresseDepuisStripe(livraison?.name, livraison?.address, client?.phone) ??
            facturation ??
            Prisma.DbNull,
          stripePaymentIntentId: paymentIntentId,
          events: { create: { status: "PAID", note: "Paiement confirmé par Stripe" } },
        },
      });

      return { type: "payee", commandeId: commande.id } as const;
    });
  } catch (erreur) {
    if (!(erreur instanceof RuptureDeStock)) throw erreur;
    return rembourserRupture(evenement, commandeId, client?.email ?? null, paymentIntentId);
  }
}

/** Plus assez de stock au moment du paiement : la commande est annulée et remboursée. */
async function rembourserRupture(
  evenement: Stripe.Event,
  commandeId: string,
  email: string | null,
  paymentIntentId: string | undefined,
): Promise<IssuePaiement> {
  await db.$transaction([
    db.stripeEvent.create({ data: { id: evenement.id, type: evenement.type } }),
    db.order.update({
      where: { id: commandeId },
      data: {
        status: "CANCELLED",
        email,
        stripePaymentIntentId: paymentIntentId,
        events: {
          create: { status: "CANCELLED", note: "Rupture de stock au moment du paiement" },
        },
      },
    }),
  ]);

  if (paymentIntentId) {
    try {
      await stripe().refunds.create(
        { payment_intent: paymentIntentId, reason: "requested_by_customer" },
        { idempotencyKey: `remboursement-${commandeId}` },
      );
      await db.order.update({
        where: { id: commandeId },
        data: {
          status: "REFUNDED",
          refundedAt: new Date(),
          events: { create: { status: "REFUNDED", note: "Remboursement automatique" } },
        },
      });
    } catch (erreur) {
      // La commande reste annulée : l'admin verra qu'il faut rembourser à la main.
      console.error(`Remboursement automatique impossible pour la commande ${commandeId}`, erreur);
    }
  }
  return { type: "rupture", commandeId };
}

async function annulerCommande(
  evenement: Stripe.Event,
  session: Stripe.Checkout.Session,
): Promise<IssuePaiement> {
  const commandeId = session.metadata?.commandeId;
  if (!commandeId) return { type: "ignore", raison: "session sans commande" };

  return db.$transaction(async (tx) => {
    await tx.stripeEvent.create({ data: { id: evenement.id, type: evenement.type } });
    const { count } = await tx.order.updateMany({
      where: { id: commandeId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    if (count === 0) return { type: "ignore", raison: "commande déjà traitée" } as const;
    await tx.orderEvent.create({
      data: {
        orderId: commandeId,
        status: "CANCELLED",
        note:
          evenement.type === "checkout.session.expired"
            ? "Session de paiement expirée"
            : "Paiement refusé",
      },
    });
    return { type: "annulee", commandeId } as const;
  });
}
