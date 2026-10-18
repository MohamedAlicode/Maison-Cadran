"use server";

// Départ vers le paiement : le panier est relu en base, le stock revérifié, une commande
// « en attente » est créée, puis le client est redirigé vers Stripe Checkout.
// Le stock ne baisse qu'à la confirmation du paiement (webhook), jamais ici.
import { redirect } from "next/navigation";
import { boutique } from "@/config/boutique";
import { creerCommandeEnAttente } from "@/lib/commandes/creation";
import { parametresSessionStripe } from "@/lib/commandes/session-stripe";
import { clientConnecte } from "@/lib/compte/serveur";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import {
  detaillerPanier,
  enregistrerContenuPanier,
  lireCodePromo,
  lireContenuPanier,
} from "@/lib/panier/serveur";
import { paiementConfigure, stripe } from "@/lib/stripe";

export type EtatCommande = { message: string } | null;

export async function passerCommande(): Promise<EtatCommande> {
  if (!paiementConfigure) {
    return {
      message:
        "Le paiement n'est pas encore activé sur ce site de démonstration : la clé Stripe de test manque.",
    };
  }

  const contenu = await lireContenuPanier();
  const panier = await detaillerPanier(contenu, await lireCodePromo());
  if (panier.lignes.length === 0) return { message: "Votre panier est vide." };
  // Le panier affiche déjà le refus : on ne fait pas payer plus que prévu sans prévenir.
  if (panier.codeRefuse) {
    return {
      message: `Le code ${panier.codeRefuse.code} ne s'applique plus : retirez-le pour continuer.`,
    };
  }

  // Le stock a pu bouger depuis l'affichage : on enregistre le panier corrigé et on le montre
  // au client avant de lui faire payer quoi que ce soit.
  if (panier.retirees > 0 || panier.lignes.some((l) => l.ajustee)) {
    await enregistrerContenuPanier(panier.lignes.map(({ id, quantite }) => ({ id, quantite })));
    return {
      message:
        "Le stock a changé pendant votre visite : votre panier a été mis à jour. Vérifiez-le avant de payer.",
    };
  }

  const client = await clientConnecte();
  const commande = await creerCommandeEnAttente(panier, client?.id);

  let url: string | null;
  try {
    // Le coupon porte le montant exact calculé ici : Stripe n'applique aucune règle à notre place.
    const coupon =
      panier.codePromo && panier.remiseCentimes > 0
        ? await stripe().coupons.create(
            {
              amount_off: panier.remiseCentimes,
              currency: boutique.devise.toLowerCase(),
              duration: "once",
              max_redemptions: 1,
              name: `Code ${panier.codePromo.code}`,
            },
            { idempotencyKey: `coupon-${commande.id}` },
          )
        : null;
    const session = await stripe().checkout.sessions.create(
      parametresSessionStripe({
        commande: { id: commande.id, numero: commande.number },
        lignes: panier.lignes,
        montants: panier,
        urlSite: env.NEXT_PUBLIC_SITE_URL,
        maintenantS: Math.floor(Date.now() / 1000),
        emailClient: client?.email,
        couponId: coupon?.id,
      }),
      { idempotencyKey: `commande-${commande.id}` },
    );
    await db.order.update({
      where: { id: commande.id },
      data: { stripeCheckoutSessionId: session.id },
    });
    url = session.url;
  } catch (erreur) {
    console.error("Création de la session Stripe impossible", erreur);
    await db.order.update({
      where: { id: commande.id },
      data: {
        status: "CANCELLED",
        events: { create: { status: "CANCELLED", note: "Session de paiement non créée" } },
      },
    });
    url = null;
  }

  if (!url) {
    return { message: "Le paiement est momentanément indisponible. Réessayez dans un instant." };
  }
  // redirect() lève une exception que Next intercepte : il doit rester hors du try/catch.
  redirect(url);
}
