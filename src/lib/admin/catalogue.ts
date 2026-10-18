// Lectures du catalogue pour le back-office : tous les statuts, jamais mises en cache.
import "server-only";
import type { ProduitEdite } from "@/components/admin/formulaire-produit";
import type { ProductStatus } from "@/generated/prisma/enums";
import { centimesEnSaisie } from "@/lib/admin/regles";
import { db } from "@/lib/db";

export async function listeProduitsAdmin({
  statut,
  stockBas,
  recherche,
}: {
  statut?: ProductStatus;
  stockBas?: boolean;
  recherche?: string;
}) {
  const produits = await db.product.findMany({
    where: {
      status: statut,
      ...(recherche && {
        OR: [
          { name: { contains: recherche, mode: "insensitive" } },
          { reference: { contains: recherche, mode: "insensitive" } },
          { brand: { name: { contains: recherche, mode: "insensitive" } } },
        ],
      }),
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      reference: true,
      status: true,
      priceCents: true,
      stock: true,
      lowStockThreshold: true,
      brand: { select: { name: true } },
      images: { orderBy: { position: "asc" }, take: 1, select: { url: true } },
    },
  });
  // Prisma ne compare pas deux colonnes entre elles : le filtre « stock bas » se fait ici.
  return stockBas ? produits.filter((p) => p.stock <= p.lowStockThreshold) : produits;
}

export async function optionsCatalogue() {
  const [marques, collections] = await Promise.all([
    db.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.collection.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  return {
    marques: marques.map((m) => ({ valeur: m.id, libelle: m.name })),
    collections: collections.map((c) => ({ valeur: c.id, libelle: c.name })),
  };
}

/** Valeurs par défaut d'une nouvelle montre : brouillon, sans stock, garantie de la boutique. */
export const nouveauProduit: ProduitEdite = {
  statut: "DRAFT",
  stock: "0",
  seuilStockBas: "2",
  delaiExpeditionJours: "2",
  garantieMois: "24",
  genre: "MIXTE",
  mouvement: "AUTOMATIQUE",
  matiereBoitier: "ACIER",
  bracelet: "ACIER",
};

/** Produit en saisies texte pour préremplir le formulaire. */
export async function produitPourEdition(id: string) {
  const p = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" }, select: { url: true, alt: true } },
      collections: { select: { collectionId: true } },
      brand: { select: { name: true } },
    },
  });
  if (!p) return null;
  const texte = (v: { toString(): string } | null | undefined) => (v == null ? "" : String(v));
  const decimal = (v: { toNumber(): number } | null) =>
    v == null ? "" : String(v.toNumber()).replace(".", ",");
  const produit: ProduitEdite = {
    id: p.id,
    marqueId: p.brandId,
    nom: p.name,
    slug: p.slug,
    reference: p.reference,
    statut: p.status,
    resume: p.shortDescription,
    description: p.description,
    avisMaison: texte(p.editorialNote),
    prix: centimesEnSaisie(p.priceCents),
    prixBarre: centimesEnSaisie(p.compareAtCents),
    stock: texte(p.stock),
    seuilStockBas: texte(p.lowStockThreshold),
    delaiExpeditionJours: texte(p.leadTimeDays),
    garantieMois: texte(p.warrantyMonths),
    genre: p.gender,
    mouvement: p.movement,
    calibre: texte(p.caliber),
    reserveMarcheH: texte(p.powerReserveH),
    diametreMm: decimal(p.caseDiameterMm),
    epaisseurMm: decimal(p.caseThicknessMm),
    entreCornesMm: texte(p.lugWidthMm),
    matiereBoitier: p.caseMaterial,
    bracelet: p.strapType,
    couleurBracelet: texte(p.strapColor),
    couleurCadran: p.dialColor,
    etancheiteM: texte(p.waterResistanceM),
    verre: texte(p.crystal),
    fonctions: p.functions.join(", "),
    titreSeo: texte(p.metaTitle),
    descriptionSeo: texte(p.metaDescription),
  };
  return {
    produit,
    nom: `${p.brand.name} ${p.name}`,
    slug: p.slug,
    statut: p.status,
    photos: p.images,
    collections: p.collections.map((c) => c.collectionId),
  };
}
