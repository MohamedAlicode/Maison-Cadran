// Filtres et tri du catalogue.
// Les filtres vivent dans l'URL (/montres?marque=tissot,seiko&mouvement=automatique&tri=prix-croissant) :
// une recherche se partage et se met en favori. Ce module est pur (aucun accès base) et testé.

import { z } from "zod";
import { libellesBracelet, libelleCouleur, libellesMatiere, libellesMouvement } from "./libelles";
import { formatPrixCourt } from "./prix";

/** Données minimales d'un produit nécessaires au filtrage, au tri et à l'affichage en carte. */
export type ProduitIndexe = {
  id: string;
  slug: string;
  marqueSlug: string;
  marqueNom: string;
  nom: string;
  detail: string;
  prixCentimes: number;
  prixBarreCentimes: number | null;
  genre: "HOMME" | "FEMME" | "MIXTE";
  mouvement: string;
  diametreMm: number;
  boitier: string;
  bracelet: string;
  cadran: string;
  etancheiteM: number;
  stock: number;
  /** Date de mise en ligne, en millisecondes. */
  creeLe: number;
  nouveau: boolean;
  image: { url: string; alt: string } | null;
  imageSurvol: { url: string; alt: string } | null;
};

// ─── Tranches proposées dans les filtres ───

export const tranchesPrix = [
  { cle: "moins-300", libelle: `Moins de ${formatPrixCourt(30_000)}`, min: 0, max: 29_999 },
  {
    cle: "300-600",
    libelle: `${formatPrixCourt(30_000)} à ${formatPrixCourt(60_000)}`,
    min: 30_000,
    max: 59_999,
  },
  {
    cle: "600-1000",
    libelle: `${formatPrixCourt(60_000)} à ${formatPrixCourt(100_000)}`,
    min: 60_000,
    max: 99_999,
  },
  { cle: "plus-1000", libelle: `Plus de ${formatPrixCourt(100_000)}`, min: 100_000, max: Infinity },
] as const;

export const tranchesDiametre = [
  { cle: "moins-36", libelle: "Moins de 36 mm", min: 0, max: 35.9 },
  { cle: "36-39", libelle: "36 à 39 mm", min: 36, max: 39.9 },
  { cle: "40-42", libelle: "40 à 42 mm", min: 40, max: 42.4 },
  { cle: "plus-42", libelle: "Plus de 42 mm", min: 42.5, max: Infinity },
] as const;

export const tranchesEtancheite = [
  { cle: "quotidien", libelle: "Jusqu'à 50 m (pluie, éclaboussures)", min: 0, max: 50 },
  { cle: "natation", libelle: "100 m (natation)", min: 51, max: 199 },
  { cle: "plongee", libelle: "200 m et plus (plongée)", min: 200, max: Infinity },
] as const;

export const optionsGenre = [
  { cle: "homme", libelle: "Homme" },
  { cle: "femme", libelle: "Femme" },
  { cle: "mixte", libelle: "Mixte" },
] as const;

export const optionsTri = [
  { cle: "selection", libelle: "Notre sélection" },
  { cle: "nouveautes", libelle: "Nouveautés" },
  { cle: "prix-croissant", libelle: "Prix croissant" },
  { cle: "prix-decroissant", libelle: "Prix décroissant" },
] as const;

export type CleTri = (typeof optionsTri)[number]["cle"];

// ─── Lecture de l'URL ───

/** Liste séparée par des virgules → tableau de valeurs nettoyées (inconnues ignorées plus loin). */
const liste = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => {
    const brut = Array.isArray(v) ? v.join(",") : (v ?? "");
    return [
      ...new Set(
        brut
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter((s) => /^[a-z0-9-]{1,40}$/.test(s)),
      ),
    ].slice(0, 20);
  });

const schemaFiltres = z.object({
  marque: liste,
  prix: liste,
  mouvement: liste,
  diametre: liste,
  boitier: liste,
  bracelet: liste,
  etancheite: liste,
  cadran: liste,
  genre: liste,
  tri: z
    .string()
    .optional()
    .transform((v) => (optionsTri.some((o) => o.cle === v) ? (v as CleTri) : "selection")),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .catch(1)
    .transform((v) => v ?? 1),
});

export type Filtres = z.output<typeof schemaFiltres>;
export type CleFiltre = Exclude<keyof Filtres, "tri" | "page">;

export const clesFiltres: CleFiltre[] = [
  "genre",
  "marque",
  "prix",
  "mouvement",
  "diametre",
  "boitier",
  "bracelet",
  "etancheite",
  "cadran",
];

export function lireFiltres(params: Record<string, string | string[] | undefined>): Filtres {
  return schemaFiltres.parse(params);
}

/** Sérialise les filtres en query string stable (ordre fixe), sans les valeurs par défaut. */
export function versQueryString(filtres: Partial<Filtres>): string {
  const params = new URLSearchParams();
  for (const cle of clesFiltres) {
    const valeurs = filtres[cle];
    if (valeurs && valeurs.length > 0) params.set(cle, [...valeurs].sort().join(","));
  }
  if (filtres.tri && filtres.tri !== "selection") params.set("tri", filtres.tri);
  if (filtres.page && filtres.page > 1) params.set("page", String(filtres.page));
  const qs = params.toString().replaceAll("%2C", ",");
  return qs ? `?${qs}` : "";
}

export function nombreFiltresActifs(filtres: Filtres) {
  return clesFiltres.reduce((total, cle) => total + filtres[cle].length, 0);
}

// ─── Correspondance produit ↔ filtre ───

function dansTranche(
  valeur: number,
  tranches: readonly { cle: string; min: number; max: number }[],
  cles: string[],
) {
  return tranches.some((t) => cles.includes(t.cle) && valeur >= t.min && valeur <= t.max);
}

/** Valeur(s) d'un produit pour un filtre donné, telles qu'elles apparaissent dans l'URL. */
function valeursProduit(produit: ProduitIndexe, cle: CleFiltre): string[] {
  switch (cle) {
    case "marque":
      return [produit.marqueSlug];
    case "mouvement":
      return [produit.mouvement.toLowerCase()];
    case "boitier":
      return [produit.boitier.toLowerCase()];
    case "bracelet":
      return [produit.bracelet.toLowerCase()];
    case "cadran":
      return [produit.cadran];
    case "genre":
      // Une montre mixte convient aussi aux recherches « homme » et « femme ».
      return produit.genre === "MIXTE"
        ? ["homme", "femme", "mixte"]
        : [produit.genre.toLowerCase()];
    case "prix":
      return tranchesPrix
        .filter((t) => produit.prixCentimes >= t.min && produit.prixCentimes <= t.max)
        .map((t) => t.cle);
    case "diametre":
      return tranchesDiametre
        .filter((t) => produit.diametreMm >= t.min && produit.diametreMm <= t.max)
        .map((t) => t.cle);
    case "etancheite":
      return tranchesEtancheite
        .filter((t) => produit.etancheiteM >= t.min && produit.etancheiteM <= t.max)
        .map((t) => t.cle);
  }
}

/** Le produit satisfait-il tous les filtres (sauf éventuellement un, pour les compteurs) ? */
export function correspond(produit: ProduitIndexe, filtres: Filtres, sauf?: CleFiltre) {
  return clesFiltres.every((cle) => {
    if (cle === sauf) return true;
    const choisis = filtres[cle];
    if (choisis.length === 0) return true;
    if (cle === "prix") return dansTranche(produit.prixCentimes, tranchesPrix, choisis);
    if (cle === "diametre") return dansTranche(produit.diametreMm, tranchesDiametre, choisis);
    if (cle === "etancheite") return dansTranche(produit.etancheiteM, tranchesEtancheite, choisis);
    return valeursProduit(produit, cle).some((v) => choisis.includes(v));
  });
}

export function trier(produits: ProduitIndexe[], tri: CleTri): ProduitIndexe[] {
  const copie = [...produits];
  switch (tri) {
    case "prix-croissant":
      return copie.sort((a, b) => a.prixCentimes - b.prixCentimes);
    case "prix-decroissant":
      return copie.sort((a, b) => b.prixCentimes - a.prixCentimes);
    case "nouveautes":
      return copie.sort((a, b) => b.creeLe - a.creeLe);
    case "selection":
      // Disponibles d'abord, puis les plus récentes.
      return copie.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.creeLe - a.creeLe);
  }
}

// ─── Facettes (options + compteurs) ───

export type OptionFacette = { valeur: string; libelle: string; compte: number; actif: boolean };
export type Facette = { cle: CleFiltre; titre: string; options: OptionFacette[] };

const titresFacettes: Record<CleFiltre, string> = {
  genre: "Pour qui",
  marque: "Marque",
  prix: "Prix",
  mouvement: "Mouvement",
  diametre: "Diamètre du boîtier",
  boitier: "Matière du boîtier",
  bracelet: "Bracelet",
  etancheite: "Étanchéité",
  cadran: "Couleur du cadran",
};

/** Options possibles pour chaque filtre, dans l'ordre d'affichage. */
function optionsPossibles(
  cle: CleFiltre,
  produits: ProduitIndexe[],
): { valeur: string; libelle: string }[] {
  const distinctes = (extraire: (p: ProduitIndexe) => string, libelle: (v: string) => string) =>
    [...new Set(produits.map(extraire))].map((valeur) => ({ valeur, libelle: libelle(valeur) }));

  switch (cle) {
    case "genre":
      return optionsGenre.map((o) => ({ valeur: o.cle, libelle: o.libelle }));
    case "prix":
      return tranchesPrix.map((t) => ({ valeur: t.cle, libelle: t.libelle }));
    case "diametre":
      return tranchesDiametre.map((t) => ({ valeur: t.cle, libelle: t.libelle }));
    case "etancheite":
      return tranchesEtancheite.map((t) => ({ valeur: t.cle, libelle: t.libelle }));
    case "marque": {
      const noms = new Map(produits.map((p) => [p.marqueSlug, p.marqueNom]));
      return [...noms]
        .map(([valeur, libelle]) => ({ valeur, libelle }))
        .sort((a, b) => a.libelle.localeCompare(b.libelle, "fr"));
    }
    case "mouvement":
      return distinctes(
        (p) => p.mouvement.toLowerCase(),
        (v) => libellesMouvement[v.toUpperCase() as keyof typeof libellesMouvement] ?? v,
      );
    case "boitier":
      return distinctes(
        (p) => p.boitier.toLowerCase(),
        (v) => libellesMatiere[v.toUpperCase() as keyof typeof libellesMatiere] ?? v,
      );
    case "bracelet":
      return distinctes(
        (p) => p.bracelet.toLowerCase(),
        (v) => libellesBracelet[v.toUpperCase() as keyof typeof libellesBracelet] ?? v,
      );
    case "cadran":
      return distinctes((p) => p.cadran, libelleCouleur).sort((a, b) =>
        a.libelle.localeCompare(b.libelle, "fr"),
      );
  }
}

/**
 * Calcule les facettes. Le compteur d'une option indique combien de résultats on obtiendrait
 * en la cochant, en tenant compte de tous les autres filtres (comportement à la Chrono24).
 */
export function calculerFacettes(produits: ProduitIndexe[], filtres: Filtres): Facette[] {
  return clesFiltres.map((cle) => {
    const candidats = produits.filter((p) => correspond(p, filtres, cle));
    const options = optionsPossibles(cle, produits)
      .map(({ valeur, libelle }) => ({
        valeur,
        libelle,
        compte: candidats.filter((p) => correspond(p, { ...filtres, [cle]: [valeur] })).length,
        actif: filtres[cle].includes(valeur),
      }))
      // Une option sans résultat n'est montrée que si elle est cochée (pour pouvoir la décocher).
      .filter((o) => o.compte > 0 || o.actif);
    return { cle, titre: titresFacettes[cle], options };
  });
}

export const PRODUITS_PAR_PAGE = 24;

/** Applique filtres, tri et pagination. */
export function rechercher(produits: ProduitIndexe[], filtres: Filtres) {
  const resultats = trier(
    produits.filter((p) => correspond(p, filtres)),
    filtres.tri,
  );
  const pages = Math.max(1, Math.ceil(resultats.length / PRODUITS_PAR_PAGE));
  const page = Math.min(filtres.page, pages);
  return {
    total: resultats.length,
    page,
    pages,
    produits: resultats.slice((page - 1) * PRODUITS_PAR_PAGE, page * PRODUITS_PAR_PAGE),
    facettes: calculerFacettes(produits, filtres),
  };
}
