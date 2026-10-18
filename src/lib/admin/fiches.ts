// Marques, collections et articles pour le back-office : listes, valeurs de formulaire, champs.
import "server-only";
import type { ChampSimple } from "@/components/admin/formulaire-simple";
import { db } from "@/lib/db";

export const champsMarque: ChampSimple[] = [
  { nom: "nom", label: "Nom", requis: true },
  { nom: "slug", label: "Adresse de la page", aide: "Laissez vide pour la créer à partir du nom." },
  { nom: "pays", label: "Pays (facultatif)" },
  { nom: "anneeCreation", label: "Année de création (facultatif)", numerique: true },
  { nom: "description", label: "Présentation courte (facultatif)", zone: true },
  { nom: "histoire", label: "Histoire de la maison (facultatif)", zone: true },
  {
    nom: "ordre",
    label: "Ordre d'affichage",
    numerique: true,
    aide: "Les plus petits nombres d'abord.",
  },
];

export const champsCollection: ChampSimple[] = [
  { nom: "nom", label: "Nom", requis: true },
  { nom: "slug", label: "Adresse de la page", aide: "Laissez vide pour la créer à partir du nom." },
  { nom: "description", label: "Présentation (facultatif)", zone: true },
  {
    nom: "ordre",
    label: "Ordre d'affichage",
    numerique: true,
    aide: "Les plus petits nombres d'abord.",
  },
];

const texte = (v: string | number | null) => (v == null ? "" : String(v));

export async function listeMarquesAdmin() {
  return db.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, _count: { select: { products: true } } },
  });
}

export async function marquePourEdition(id: string) {
  const m = await db.brand.findUnique({ where: { id } });
  if (!m) return null;
  return {
    nom: m.name,
    valeurs: {
      id: m.id,
      nom: m.name,
      slug: m.slug,
      pays: texte(m.country),
      anneeCreation: texte(m.foundedYear),
      description: texte(m.description),
      histoire: texte(m.history),
      ordre: texte(m.sortOrder),
    },
  };
}

export async function listeCollectionsAdmin() {
  return db.collection.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, _count: { select: { products: true } } },
  });
}

export async function collectionPourEdition(id: string) {
  const c = await db.collection.findUnique({ where: { id } });
  if (!c) return null;
  return {
    nom: c.name,
    valeurs: {
      id: c.id,
      nom: c.name,
      slug: c.slug,
      description: texte(c.description),
      ordre: texte(c.sortOrder),
    },
  };
}

export const champsArticle: ChampSimple[] = [
  { nom: "titre", label: "Titre", requis: true },
  {
    nom: "slug",
    label: "Adresse de la page",
    aide: "Laissez vide pour la créer à partir du titre.",
  },
  { nom: "resume", label: "Chapeau", zone: true, lignes: 3, requis: true },
  {
    nom: "contenu",
    label: "Texte",
    zone: true,
    lignes: 18,
    requis: true,
    aide: "Une ligne vide entre deux paragraphes. « ## » devant un intertitre, « - » devant chaque point d'une liste, **gras**, [lien](/montres).",
  },
  {
    nom: "couverture",
    label: "Photo de couverture (facultatif)",
    aide: "Lien d'un fichier du site (/images/…) ou de Cloudinary.",
  },
  { nom: "descriptionCouverture", label: "Description de la photo" },
  { nom: "titreSeo", label: "Titre pour Google (facultatif)" },
  { nom: "descriptionSeo", label: "Description pour Google (facultatif)", zone: true, lignes: 2 },
  {
    nom: "publie",
    label: "Publié",
    caseACocher: true,
    aide: "Décoché, l'article reste un brouillon visible seulement ici.",
  },
];

export async function listeArticlesAdmin() {
  return db.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, publishedAt: true },
  });
}

export async function articlePourEdition(id: string) {
  const a = await db.article.findUnique({ where: { id } });
  if (!a) return null;
  return {
    titre: a.title,
    slug: a.slug,
    publie: a.publishedAt !== null,
    valeurs: {
      id: a.id,
      titre: a.title,
      slug: a.slug,
      resume: a.excerpt,
      contenu: a.content,
      couverture: texte(a.coverUrl),
      descriptionCouverture: texte(a.coverAlt),
      titreSeo: texte(a.metaTitle),
      descriptionSeo: texte(a.metaDescription),
      publie: a.publishedAt ? "on" : "",
    },
  };
}
