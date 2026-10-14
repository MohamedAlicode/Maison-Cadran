// Paramètres de la session Stripe Checkout, construits uniquement à partir des montants
// recalculés côté serveur. Fonction pure : testée sans appeler Stripe.
import type Stripe from "stripe";
import { boutique } from "@/config/boutique";
import type { LignePanier } from "@/lib/panier/serveur";
import type { MontantsPanier } from "@/lib/panier/regles";

/** Une session ouverte expire au bout d'une heure ; Stripe impose entre 30 minutes et 24 heures. */
export const DUREE_SESSION_S = 60 * 60;

export function parametresSessionStripe({
  commande,
  lignes,
  montants,
  urlSite,
  maintenantS,
}: {
  commande: { id: string; numero: string };
  lignes: Pick<LignePanier, "id" | "nom" | "marque" | "reference" | "prixCentimes" | "quantite">[];
  montants: Pick<MontantsPanier, "livraisonCentimes">;
  urlSite: string;
  maintenantS: number;
}): Stripe.Checkout.SessionCreateParams {
  const devise = boutique.devise.toLowerCase();
  return {
    mode: "payment",
    locale: "fr",
    currency: devise,
    client_reference_id: commande.id,
    metadata: { commandeId: commande.id, numero: commande.numero },
    payment_intent_data: { metadata: { commandeId: commande.id, numero: commande.numero } },
    line_items: lignes.map((l) => ({
      quantity: l.quantite,
      price_data: {
        currency: devise,
        unit_amount: l.prixCentimes,
        product_data: {
          name: `${l.marque} ${l.nom}`,
          description: `Réf. ${l.reference}`,
          metadata: { produitId: l.id },
        },
      },
    })),
    shipping_address_collection: { allowed_countries: [boutique.pays] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: boutique.livraison.transporteur,
          fixed_amount: { amount: montants.livraisonCentimes, currency: devise },
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 4 },
          },
        },
      },
    ],
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    expires_at: maintenantS + DUREE_SESSION_S,
    success_url: `${urlSite}/commande/retour?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${urlSite}/panier?paiement=annule`,
  };
}
