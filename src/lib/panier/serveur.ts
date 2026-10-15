// Lecture et écriture du panier côté serveur.
// Les prix et le stock sont relus en base à chaque affichage, sans cache : le panier doit
// montrer ce qui sera réellement facturé.
import "server-only";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  COOKIE_PANIER,
  DUREE_COOKIE_PANIER_S,
  calculerMontants,
  ecrireContenu,
  lireContenu,
  quantiteMax,
  type LigneCookie,
  type MontantsPanier,
} from "./regles";

export type LignePanier = {
  id: string;
  slug: string;
  nom: string;
  marque: string;
  reference: string;
  image: { url: string; alt: string } | null;
  prixCentimes: number;
  tauxTvaPb: number;
  quantite: number;
  quantiteMax: number;
  /** La quantité demandée dépassait le stock et a été réduite. */
  ajustee: boolean;
};

export type Panier = MontantsPanier & {
  lignes: LignePanier[];
  /** Nombre de montres retirées parce qu'elles ne sont plus disponibles. */
  retirees: number;
};

export async function lireContenuPanier(): Promise<LigneCookie[]> {
  const magasin = await cookies();
  return lireContenu(magasin.get(COOKIE_PANIER)?.value);
}

/** À appeler uniquement depuis une Server Action ou un Route Handler. */
export async function enregistrerContenuPanier(lignes: LigneCookie[]) {
  const magasin = await cookies();
  if (lignes.length === 0) {
    magasin.delete(COOKIE_PANIER);
    return;
  }
  magasin.set(COOKIE_PANIER, ecrireContenu(lignes), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_COOKIE_PANIER_S,
  });
}

/** Relit en base les montres d'un contenu de panier et calcule les montants. */
export async function detaillerPanier(contenu: LigneCookie[]): Promise<Panier> {
  const produits =
    contenu.length === 0
      ? []
      : await db.product.findMany({
          where: { id: { in: contenu.map((l) => l.id) }, status: "PUBLISHED" },
          select: {
            id: true,
            slug: true,
            name: true,
            reference: true,
            priceCents: true,
            vatRate: true,
            stock: true,
            brand: { select: { name: true } },
            images: { orderBy: { position: "asc" }, take: 1, select: { url: true, alt: true } },
          },
        });

  const lignes: LignePanier[] = [];
  for (const { id, quantite } of contenu) {
    const p = produits.find((produit) => produit.id === id);
    const max = p ? quantiteMax(p.stock) : 0;
    if (!p || max === 0) continue;
    lignes.push({
      id: p.id,
      slug: p.slug,
      nom: p.name,
      marque: p.brand.name,
      reference: p.reference,
      image: p.images[0] ?? null,
      prixCentimes: p.priceCents,
      tauxTvaPb: p.vatRate,
      quantite: Math.min(quantite, max),
      quantiteMax: max,
      ajustee: quantite > max,
    });
  }

  return {
    lignes,
    retirees: contenu.length - lignes.length,
    ...calculerMontants(lignes),
  };
}

export async function lirePanier(): Promise<Panier> {
  return detaillerPanier(await lireContenuPanier());
}
