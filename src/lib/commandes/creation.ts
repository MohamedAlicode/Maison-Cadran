// Création d'une commande « en attente » juste avant de partir vers Stripe Checkout.
// La commande fige un instantané des montres et des montants : modifier un produit plus tard
// ne réécrira jamais une commande ni une facture.
import "server-only";
import { db } from "@/lib/db";
import type { Panier } from "@/lib/panier/serveur";
import { numeroCommande } from "./numeros";

/** `clientId` : rattache la commande au compte du client connecté. */
export async function creerCommandeEnAttente(panier: Panier, clientId?: string) {
  const [{ sequence }] = await db.$queryRaw<{ sequence: bigint }[]>`
    SELECT nextval('commande_numero_seq') AS sequence
  `;

  return db.order.create({
    data: {
      number: numeroCommande(new Date().getFullYear(), Number(sequence)),
      userId: clientId,
      subtotalCents: panier.sousTotalCentimes,
      discountCents: panier.remiseCentimes,
      discountCodeId: panier.codePromo?.id,
      discountCode: panier.codePromo?.code,
      shippingCents: panier.livraisonCentimes,
      totalCents: panier.totalCentimes,
      vatCents: panier.tvaCentimes,
      carrier: "Colissimo",
      items: {
        create: panier.lignes.map((l) => ({
          productId: l.id,
          productName: l.nom,
          brandName: l.marque,
          reference: l.reference,
          imageUrl: l.image?.url,
          unitPriceCents: l.prixCentimes,
          vatRate: l.tauxTvaPb,
          quantity: l.quantite,
        })),
      },
      events: { create: { status: "PENDING", note: "Session de paiement créée" } },
    },
    select: { id: true, number: true },
  });
}
