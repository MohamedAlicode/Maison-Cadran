// Lectures du catalogue, mises en cache (directive « use cache ») : les pages restent statiques
// et rapides, et seront invalidées par l'étiquette « catalogue » quand l'admin modifiera un produit.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { ProduitIndexe } from "@/lib/filtres";
import { libellesBracelet, libellesMatiere, libellesMouvement } from "@/lib/libelles";

const JOURS_NOUVEAUTE = 30;
const JOUR = 24 * 60 * 60 * 1000;

function nombre(valeur: { toNumber(): number } | number | null | undefined) {
  if (valeur === null || valeur === undefined) return null;
  return typeof valeur === "number" ? valeur : valeur.toNumber();
}

/** Diamètre lisible à la française : 40.5 → « 40,5 mm ». */
export function formatMm(mm: number) {
  return `${mm.toLocaleString("fr-FR")} mm`;
}

/** Tous les produits publiés, sous une forme légère pour le filtrage et les cartes. */
export async function indexCatalogue(): Promise<ProduitIndexe[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const produits = await db.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      brand: { select: { slug: true, name: true } },
      images: { orderBy: { position: "asc" }, take: 2, select: { url: true, alt: true } },
    },
  });

  const maintenant = Date.now();
  return produits.map((p) => {
    const diametre = nombre(p.caseDiameterMm)!;
    const matiere =
      p.strapType === "ACIER" || p.strapType === "TITANE"
        ? ""
        : `, ${libellesBracelet[p.strapType].toLowerCase()}`;
    return {
      id: p.id,
      slug: p.slug,
      marqueSlug: p.brand.slug,
      marqueNom: p.brand.name,
      nom: p.name,
      detail: `${libellesMouvement[p.movement]}, ${formatMm(diametre)}, ${libellesMatiere[p.caseMaterial].toLowerCase()}${matiere}`,
      prixCentimes: p.priceCents,
      prixBarreCentimes: p.compareAtCents,
      genre: p.gender,
      mouvement: p.movement,
      diametreMm: diametre,
      boitier: p.caseMaterial,
      bracelet: p.strapType,
      cadran: p.dialColor,
      etancheiteM: p.waterResistanceM,
      stock: p.stock,
      creeLe: p.createdAt.getTime(),
      nouveau: maintenant - p.createdAt.getTime() < JOURS_NOUVEAUTE * JOUR,
      image: p.images[0] ?? null,
      imageSurvol: p.images[1] ?? null,
    };
  });
}

/** Fiche complète d'un produit publié, ou null. */
export async function produitParSlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue", `produit:${slug}`);

  const p = await db.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!p) return null;

  const declinaisons = p.familyKey
    ? await db.product.findMany({
        where: { familyKey: p.familyKey, status: "PUBLISHED" },
        select: { slug: true, dialColor: true, stock: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const notes = p.reviews.map((r) => r.rating);
  return {
    ...p,
    caseDiameterMm: nombre(p.caseDiameterMm)!,
    caseThicknessMm: nombre(p.caseThicknessMm),
    reviews: p.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      createdAt: r.createdAt,
      auteur: r.user.name ?? "Client",
      achatVerifie: r.orderId !== null,
    })),
    noteMoyenne: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null,
    declinaisons,
  };
}

export type FicheProduit = NonNullable<Awaited<ReturnType<typeof produitParSlug>>>;

/** Slugs à prérendre au build. */
export async function slugsProduits() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  const produits = await db.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return produits.map((p) => p.slug);
}

/**
 * Montres similaires : même mouvement ou même marque, prix proche (±40 %),
 * en privilégiant les modèles disponibles.
 */
export async function produitsSimilaires(slug: string, limite = 4) {
  const index = await indexCatalogue();
  const reference = index.find((p) => p.slug === slug);
  if (!reference) return [];
  const score = (p: ProduitIndexe) =>
    (p.mouvement === reference.mouvement ? 2 : 0) +
    (p.marqueSlug === reference.marqueSlug ? 1 : 0) +
    (p.cadran === reference.cadran ? 1 : 0) +
    (p.stock > 0 ? 1 : 0);
  return index
    .filter(
      (p) =>
        p.slug !== slug &&
        Math.abs(p.prixCentimes - reference.prixCentimes) <= reference.prixCentimes * 0.4,
    )
    .sort((a, b) => score(b) - score(a) || a.prixCentimes - b.prixCentimes)
    .slice(0, limite);
}

/** Marques ayant au moins un produit publié, avec leur nombre de montres. */
export async function listeMarques() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  const marques = await db.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
  return marques
    .filter((m) => m._count.products > 0)
    .map(({ _count, ...m }) => ({ ...m, nombreMontres: _count.products }));
}

export async function marqueParSlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  return db.brand.findUnique({ where: { slug } });
}

export async function collectionParSlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  const collection = await db.collection.findUnique({
    where: { slug },
    include: {
      products: { orderBy: { position: "asc" }, select: { product: { select: { slug: true } } } },
    },
  });
  if (!collection) return null;
  const { products, ...reste } = collection;
  return { ...reste, slugsProduits: products.map((p) => p.product.slug) };
}

export async function listeCollections() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  return db.collection.findMany({ orderBy: { sortOrder: "asc" } });
}

/** Montres les mieux notées par les clients (en attendant assez de ventes pour un vrai classement). */
export async function produitsPlusApprecies(limite = 4) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");
  const notes = await db.review.groupBy({
    by: ["productId"],
    where: { status: "APPROVED", product: { status: "PUBLISHED", stock: { gt: 0 } } },
    _avg: { rating: true },
    _count: { rating: true },
  });
  const classement = notes
    .sort(
      (a, b) => (b._avg.rating ?? 0) - (a._avg.rating ?? 0) || b._count.rating - a._count.rating,
    )
    .map((n) => n.productId);
  const index = await indexCatalogue();
  return classement
    .map((id) => index.find((p) => p.id === id))
    .filter((p): p is ProduitIndexe => Boolean(p))
    .slice(0, limite);
}
