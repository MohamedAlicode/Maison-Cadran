// Lecture et écriture du panier côté serveur.
// Les prix et le stock sont relus en base à chaque affichage, sans cache : le panier doit
// montrer ce qui sera réellement facturé.
import "server-only";
import { cookies } from "next/headers";
import { clientConnecte } from "@/lib/compte/serveur";
import { db } from "@/lib/db";
import { COOKIE_CODE_PROMO, montantRemise, normaliserCode, refusCode } from "./codes-promo";
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
  /** Code promo appliqué, avec son identifiant pour la commande. */
  codePromo: { id: string; code: string } | null;
  /** Code saisi qui ne s'applique pas (ou plus), et pourquoi. */
  codeRefuse: { code: string; raison: string } | null;
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

export async function lireCodePromo(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_CODE_PROMO)?.value;
}

/** À appeler uniquement depuis une Server Action. Sans code, le cookie est effacé. */
export async function enregistrerCodePromo(code: string | null) {
  const magasin = await cookies();
  if (!code) {
    magasin.delete(COOKIE_CODE_PROMO);
    return;
  }
  magasin.set(COOKIE_CODE_PROMO, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_COOKIE_PANIER_S,
  });
}

/** Vérifie un code pour un sous-total : remise accordée, ou raison du refus. */
export async function verifierCodePromo(saisie: string, sousTotalCentimes: number) {
  const code = normaliserCode(saisie);
  const trouve = code ? await db.discountCode.findUnique({ where: { code } }) : null;
  const client = trouve?.perCustomerMax != null ? await clientConnecte() : null;
  const usagesClient = client
    ? await db.order.count({
        where: {
          userId: client.id,
          discountCodeId: trouve!.id,
          status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        },
      })
    : 0;
  const raison = refusCode(trouve, { sousTotalCentimes, maintenant: new Date(), usagesClient });
  if (raison || !trouve) return { ok: false as const, code, raison: raison! };
  return {
    ok: true as const,
    id: trouve.id,
    code,
    remiseCentimes: montantRemise(trouve, sousTotalCentimes),
  };
}

/** Relit en base les montres d'un contenu de panier et calcule les montants. */
export async function detaillerPanier(
  contenu: LigneCookie[],
  saisieCode?: string,
): Promise<Panier> {
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

  const sousTotal = calculerMontants(lignes).sousTotalCentimes;
  const verification =
    saisieCode && lignes.length > 0 ? await verifierCodePromo(saisieCode, sousTotal) : null;
  return {
    lignes,
    retirees: contenu.length - lignes.length,
    ...calculerMontants(lignes, verification?.ok ? verification.remiseCentimes : 0),
    codePromo: verification?.ok ? { id: verification.id, code: verification.code } : null,
    codeRefuse:
      verification?.ok === false ? { code: verification.code, raison: verification.raison } : null,
  };
}

export async function lirePanier(): Promise<Panier> {
  const [contenu, code] = await Promise.all([lireContenuPanier(), lireCodePromo()]);
  return detaillerPanier(contenu, code);
}
