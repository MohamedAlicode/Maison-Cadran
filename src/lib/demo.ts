// Données de démonstration de la phase 1 (accueil et page design system).
// Elles seront remplacées par la base de données en phase 2.
import type { ProduitCarte } from "@/components/catalogue/product-card";

export type ProduitDemo = ProduitCarte & {
  couleurs: { cadran: string; boitier: string; bracelet: string };
};

export const produitsDemo: ProduitDemo[] = [
  {
    slug: "tissot-prx-powermatic-80-40mm-bleu",
    marque: "Tissot",
    nom: "PRX Powermatic 80",
    detail: "Automatique, 40 mm, acier",
    prixCentimes: 72_500,
    badge: { libelle: "Nouveau", variante: "nouveau" },
    couleurs: { cadran: "#1f3a5f", boitier: "#cfcac1", bracelet: "#bdb7ad" },
  },
  {
    slug: "hamilton-khaki-field-mechanical-38mm",
    marque: "Hamilton",
    nom: "Khaki Field Mechanical",
    detail: "Remontage manuel, 38 mm, toile",
    prixCentimes: 59_500,
    couleurs: { cadran: "#2b2f26", boitier: "#c8c4bc", bracelet: "#6b6a4f" },
  },
  {
    slug: "seiko-presage-cocktail-time",
    marque: "Seiko",
    nom: "Presage Cocktail Time",
    detail: "Automatique, 40,5 mm, cuir",
    prixCentimes: 49_000,
    badge: { libelle: "Dernière pièce", variante: "alerte" },
    couleurs: { cadran: "#5b7fa3", boitier: "#d2cdc4", bracelet: "#5a3a24" },
  },
  {
    slug: "citizen-tsuyosa-vert",
    marque: "Citizen",
    nom: "Tsuyosa",
    detail: "Automatique, 40 mm, acier",
    prixCentimes: 36_900,
    prixBarreCentimes: 39_900,
    couleurs: { cadran: "#2f5a46", boitier: "#cfcac1", bracelet: "#bdb7ad" },
  },
];
