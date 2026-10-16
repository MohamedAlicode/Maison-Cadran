// Lecture d'une commande complète (lignes, facture, adresses validées), partagée par
// la page de confirmation, l'espace client, les e-mails et la facture PDF.
import "server-only";
import { db } from "@/lib/db";
import { lireAdresse } from "./adresse";

export async function chargerCommande(
  ou: { id: string } | { number: string } | { stripeCheckoutSessionId: string },
) {
  const commande = await db.order.findUnique({
    where: ou,
    include: { items: true, invoice: true },
  });
  if (!commande) return null;
  return {
    ...commande,
    adresseLivraison: lireAdresse(commande.shippingAddress),
    adresseFacturation: lireAdresse(commande.billingAddress),
  };
}

export type CommandeComplete = NonNullable<Awaited<ReturnType<typeof chargerCommande>>>;
