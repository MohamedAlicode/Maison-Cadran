// Calculs monétaires. Tous les montants sont des entiers en centimes, TTC.
// Ces fonctions sont la seule source de vérité pour les prix : le client n'envoie jamais de montant.
import { boutique } from "@/config/boutique";

const formateur = new Intl.NumberFormat(boutique.locale, {
  style: "currency",
  currency: boutique.devise,
});

/** Formate un montant en centimes : 129000 → « 1 290,00 € ». */
export function formatPrix(centimes: number): string {
  return formateur.format(centimes / 100);
}

/** Formate sans décimales quand le montant est rond : 129000 → « 1 290 € ». */
export function formatPrixCourt(centimes: number): string {
  if (centimes % 100 !== 0) return formatPrix(centimes);
  return new Intl.NumberFormat(boutique.locale, {
    style: "currency",
    currency: boutique.devise,
    maximumFractionDigits: 0,
  }).format(centimes / 100);
}

/**
 * Part de TVA incluse dans un montant TTC.
 * TVA = TTC − arrondi(TTC / (1 + taux)). Calcul en entiers pour éviter les erreurs de flottants.
 */
export function tvaIncluse(ttcCentimes: number, tauxPb: number = boutique.tauxTvaPb): number {
  const htCentimes = Math.round((ttcCentimes * 10_000) / (10_000 + tauxPb));
  return ttcCentimes - htCentimes;
}

/** Frais de livraison selon le sous-total (après remise). */
export function fraisLivraison(sousTotalCentimes: number): number {
  if (sousTotalCentimes <= 0) return 0;
  const { seuilGratuitCentimes, fraisCentimes } = boutique.livraison;
  return sousTotalCentimes >= seuilGratuitCentimes ? 0 : fraisCentimes;
}

/** Montant restant avant la livraison offerte (0 si déjà atteinte). */
export function resteAvantLivraisonOfferte(sousTotalCentimes: number): number {
  return Math.max(0, boutique.livraison.seuilGratuitCentimes - sousTotalCentimes);
}
