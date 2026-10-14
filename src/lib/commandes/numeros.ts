// Numéros lisibles des commandes et des factures.

/** MC-2026-000123 : numéro communiqué au client, tiré d'une séquence (les trous sont permis). */
export function numeroCommande(annee: number, sequence: number): string {
  return `MC-${annee}-${String(sequence).padStart(6, "0")}`;
}

/**
 * F-2026-000001 : la loi impose une numérotation des factures continue et sans trou.
 * La séquence est attribuée dans la transaction qui valide le paiement (voir paiement.ts).
 */
export function numeroFacture(annee: number, sequence: number): string {
  return `F-${annee}-${String(sequence).padStart(6, "0")}`;
}
