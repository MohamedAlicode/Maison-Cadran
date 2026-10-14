"use server";

// Server Actions du panier. Le client n'envoie qu'un identifiant et une quantité :
// le stock est revérifié ici, et les prix seront relus en base à l'affichage.
import { z } from "zod";
import { db } from "@/lib/db";
import { ajouterUn, changerQuantiteLigne, quantiteMax } from "@/lib/panier/regles";
import { enregistrerContenuPanier, lireContenuPanier } from "@/lib/panier/serveur";

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
