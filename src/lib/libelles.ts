// Libellés français des valeurs stockées en base (enums et couleurs normalisées).
import type { CaseMaterial, Gender, Movement, StrapType } from "@/generated/prisma/enums";

export const libellesGenre: Record<Gender, string> = {
  HOMME: "Homme",
  FEMME: "Femme",
  MIXTE: "Mixte",
};

export const libellesMouvement: Record<Movement, string> = {
  AUTOMATIQUE: "Automatique",
  MANUEL: "Remontage manuel",
  QUARTZ: "Quartz",
  SOLAIRE: "Solaire",
  KINETIQUE: "Kinétique",
};

export const libellesMatiere: Record<CaseMaterial, string> = {
  ACIER: "Acier",
  TITANE: "Titane",
  CERAMIQUE: "Céramique",
  OR: "Or",
  PLAQUE_OR: "Plaqué or",
  BRONZE: "Bronze",
  AUTRE: "Autre",
};

export const libellesBracelet: Record<StrapType, string> = {
  ACIER: "Acier",
  CUIR: "Cuir",
  CAOUTCHOUC: "Caoutchouc",
  NATO_TISSU: "Tissu (NATO)",
  TITANE: "Titane",
  AUTRE: "Autre",
};

/** Couleurs de cadran et de bracelet : clé normalisée → libellé. */
export const libellesCouleur: Record<string, string> = {
  bleu: "Bleu",
  vert: "Vert",
  noir: "Noir",
  argente: "Argenté",
  blanc: "Blanc",
  creme: "Crème",
  gris: "Gris",
  marron: "Marron",
  kaki: "Kaki",
  champagne: "Champagne",
};

export function libelleCouleur(cle: string) {
  return libellesCouleur[cle] ?? cle.charAt(0).toUpperCase() + cle.slice(1);
}
