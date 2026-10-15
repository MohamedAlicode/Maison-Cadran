// Règles du panier, sans accès au serveur ni à la base : testables seules.
// Le panier vit dans un cookie qui ne contient que des identifiants et des quantités.
// Rien n'y est cru sur parole : prix et stock sont toujours relus en base.
import { z } from "zod";
import { fraisLivraison, resteAvantLivraisonOfferte, tvaIncluse } from "@/lib/prix";

export const COOKIE_PANIER = "mc_panier";
export const DUREE_COOKIE_PANIER_S = 30 * 24 * 60 * 60;

/** Au-delà, un cookie de panier deviendrait trop long, et personne n'achète 20 montres différentes. */
export const LIGNES_MAX = 20;

/** Une montre de ce prix s'achète rarement en plus de quelques exemplaires. */
export const QUANTITE_MAX_PAR_MONTRE = 3;

const schemaLigne = z.object({
  id: z.cuid(),
  quantite: z.int().min(1).max(QUANTITE_MAX_PAR_MONTRE),
});

export type LigneCookie = z.infer<typeof schemaLigne>;

/**
 * Lit la valeur du cookie (« id:quantité|id:quantité »).
 * Un cookie abîmé ou trafiqué donne un panier vide plutôt qu'une erreur.
 */
export function lireContenu(valeur: string | undefined): LigneCookie[] {
  if (!valeur) return [];
  const lignes: LigneCookie[] = [];
  for (const morceau of valeur.split("|").slice(0, LIGNES_MAX)) {
    const [id, quantite] = morceau.split(":");
    const resultat = schemaLigne.safeParse({ id, quantite: Number(quantite) });
    if (resultat.success && !lignes.some((l) => l.id === resultat.data.id)) {
      lignes.push(resultat.data);
    }
  }
  return lignes;
}

export function ecrireContenu(lignes: LigneCookie[]): string {
  return lignes.map((l) => `${l.id}:${l.quantite}`).join("|");
}

/** Quantité qu'on peut réellement commander pour un stock donné. */
export function quantiteMax(stock: number): number {
  return Math.max(0, Math.min(stock, QUANTITE_MAX_PAR_MONTRE));
}

/** Ajoute un exemplaire d'une montre. La dernière montre ajoutée passe en tête du panier. */
export function ajouterUn(lignes: LigneCookie[], id: string): LigneCookie[] {
  const actuelle = lignes.find((l) => l.id === id)?.quantite ?? 0;
  const autres = lignes.filter((l) => l.id !== id);
  const quantite = Math.min(actuelle + 1, QUANTITE_MAX_PAR_MONTRE);
  return [{ id, quantite }, ...autres].slice(0, LIGNES_MAX);
}

/** Change la quantité d'une ligne sans la déplacer (0 la retire). */
export function changerQuantiteLigne(
  lignes: LigneCookie[],
  id: string,
  quantite: number,
): LigneCookie[] {
  if (quantite <= 0) return lignes.filter((l) => l.id !== id);
  const bornee = Math.min(quantite, QUANTITE_MAX_PAR_MONTRE);
  return lignes.map((l) => (l.id === id ? { id, quantite: bornee } : l));
}

export type MontantsPanier = {
  sousTotalCentimes: number;
  livraisonCentimes: number;
  totalCentimes: number;
  /** TVA incluse dans le total, calculée par ligne puis sommée (livraison comprise). */
  tvaCentimes: number;
  resteAvantLivraisonOfferteCentimes: number;
  nombreArticles: number;
};

/** Montants du panier à partir de lignes dont le prix a été relu en base. */
export function calculerMontants(
  lignes: { prixCentimes: number; tauxTvaPb: number; quantite: number }[],
): MontantsPanier {
  const sousTotalCentimes = lignes.reduce((s, l) => s + l.prixCentimes * l.quantite, 0);
  const livraisonCentimes = fraisLivraison(sousTotalCentimes);
  const tvaCentimes =
    lignes.reduce((s, l) => s + tvaIncluse(l.prixCentimes * l.quantite, l.tauxTvaPb), 0) +
    tvaIncluse(livraisonCentimes);
  return {
    sousTotalCentimes,
    livraisonCentimes,
    totalCentimes: sousTotalCentimes + livraisonCentimes,
    tvaCentimes,
    resteAvantLivraisonOfferteCentimes:
      sousTotalCentimes > 0 ? resteAvantLivraisonOfferte(sousTotalCentimes) : 0,
    nombreArticles: lignes.reduce((s, l) => s + l.quantite, 0),
  };
}
