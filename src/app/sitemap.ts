// Plan du site pour les moteurs de recherche : pages publiques seulement (ni compte, ni panier,
// ni back-office). Les listes viennent des lectures en cache du catalogue et du guide.
import type { MetadataRoute } from "next";
import { articlesPublies } from "@/lib/articles/lecture";
import { listeCollections, listeMarques, slugsProduits } from "@/lib/catalogue";

const pagesFixes = [
  "/",
  "/montres",
  "/marques",
  "/guide",
  "/faq",
  "/contact",
  "/retours",
  "/cgv",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [produits, marques, collections, articles] = await Promise.all([
    slugsProduits(),
    listeMarques(),
    listeCollections(),
    articlesPublies(),
  ]);
  return [
    ...pagesFixes,
    ...produits.map((slug) => `/montres/${slug}`),
    ...marques.map((m) => `/marques/${m.slug}`),
    ...collections.map((c) => `/collections/${c.slug}`),
    ...articles.map((a) => `/guide/${a.slug}`),
  ].map((chemin) => ({ url: new URL(chemin, site).toString() }));
}
