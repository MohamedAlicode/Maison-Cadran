"use server";

// Server Actions du panier. Le client n'envoie qu'un identifiant et une quantité :
// le stock est revérifié ici, et les prix seront relus en base à l'affichage.
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { ajouterUn, changerQuantiteLigne, quantiteMax } from "@/lib/panier/regles";
import {
  detaillerPanier,
  enregistrerCodePromo,
  enregistrerContenuPanier,
  lireContenuPanier,
} from "@/lib/panier/serveur";

export type ResultatPanier = { ok: true } | { ok: false; message: string };

const schemaId = z.cuid();
const schemaQuantite = z.int().min(0).max(99);

async function stockDisponible(id: string): Promise<number> {
  const produit = await db.product.findFirst({
    where: { id, status: "PUBLISHED" },
    select: { stock: true },
  });
  return produit ? quantiteMax(produit.stock) : 0;
}

export async function ajouterAuPanier(produitId: string): Promise<ResultatPanier> {
  const id = schemaId.safeParse(produitId);
  if (!id.success) return { ok: false, message: "Cette montre est introuvable." };

  const max = await stockDisponible(id.data);
  if (max === 0) return { ok: false, message: "Cette montre n'est plus disponible." };

  const contenu = await lireContenuPanier();
  const actuelle = contenu.find((l) => l.id === id.data)?.quantite ?? 0;
  if (actuelle >= max) {
    return {
      ok: false,
      message:
        max === 1
          ? "Cette montre est déjà dans votre panier, et c'est la dernière pièce."
          : `Vous avez déjà ${actuelle} exemplaires de cette montre dans votre panier, le maximum possible.`,
    };
  }

  await enregistrerContenuPanier(ajouterUn(contenu, id.data));
  return { ok: true };
}

export async function changerQuantite(
  produitId: string,
  quantite: number,
): Promise<ResultatPanier> {
  const id = schemaId.safeParse(produitId);
  const qte = schemaQuantite.safeParse(quantite);
  if (!id.success || !qte.success) return { ok: false, message: "Quantité invalide." };

  const max = qte.data === 0 ? 0 : await stockDisponible(id.data);
  const contenu = await lireContenuPanier();
  await enregistrerContenuPanier(changerQuantiteLigne(contenu, id.data, Math.min(qte.data, max)));
  return { ok: true };
}

export async function retirerDuPanier(produitId: string): Promise<ResultatPanier> {
  return changerQuantite(produitId, 0);
}

/**
 * Paiement refusé par la banque : le panier a été vidé au retour de Stripe, on y remet donc
 * les montres de la commande. L'identifiant de session Stripe sert de preuve, comme pour
 * afficher la commande ; prix et stock seront revérifiés à l'affichage du panier.
 */
export async function reprendreSelection(sessionId: string) {
  const id = z.string().min(1).max(255).safeParse(sessionId);
  const commande =
    id.success &&
    (await db.order.findUnique({
      where: { stripeCheckoutSessionId: id.data },
      select: {
        status: true,
        stripePaymentIntentId: true,
        items: { select: { productId: true, quantity: true } },
      },
    }));

  if (commande && commande.status === "CANCELLED" && !commande.stripePaymentIntentId) {
    let contenu = await lireContenuPanier();
    for (const { productId, quantity } of commande.items) {
      if (productId)
        contenu = changerQuantiteLigne(ajouterUn(contenu, productId), productId, quantity);
    }
    await enregistrerContenuPanier(contenu);
  }
  redirect("/panier");
}

export type EtatCodePromo = { message: string } | null;

/** Le code n'est gardé que s'il s'applique au panier tel qu'il est maintenant. */
export async function appliquerCodePromo(
  _etat: EtatCodePromo,
  formulaire: FormData,
): Promise<EtatCodePromo> {
  const saisie = z.string().max(40).safeParse(formulaire.get("code"));
  if (!saisie.success || !saisie.data.trim()) return { message: "Saisissez un code." };
  const panier = await detaillerPanier(await lireContenuPanier(), saisie.data);
  if (panier.codeRefuse) return { message: panier.codeRefuse.raison };
  await enregistrerCodePromo(panier.codePromo?.code ?? null);
  return null;
}

export async function retirerCodePromo() {
  await enregistrerCodePromo(null);
}
