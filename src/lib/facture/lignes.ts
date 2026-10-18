// Montants d'une facture, recalculés depuis l'instantané de la commande. Fonction pure.
import { boutique } from "@/config/boutique";
import { tvaIncluse } from "@/lib/prix";

export type LigneFacture = {
  designation: string;
  reference: string | null;
  quantite: number;
  prixUnitaireHtCentimes: number;
  tauxTvaPb: number;
  totalHtCentimes: number;
  totalTtcCentimes: number;
};

export function lignesFacture(commande: {
  items: {
    brandName: string;
    productName: string;
    reference: string;
    unitPriceCents: number;
    vatRate: number;
    quantity: number;
  }[];
  discountCents: number;
  discountCode: string | null;
  shippingCents: number;
}) {
  const lignes: LigneFacture[] = commande.items.map((item) => {
    const totalTtc = item.unitPriceCents * item.quantity;
    return {
      designation: `${item.brandName} ${item.productName}`,
      reference: item.reference,
      quantite: item.quantity,
      prixUnitaireHtCentimes: item.unitPriceCents - tvaIncluse(item.unitPriceCents, item.vatRate),
      tauxTvaPb: item.vatRate,
      totalHtCentimes: totalTtc - tvaIncluse(totalTtc, item.vatRate),
      totalTtcCentimes: totalTtc,
    };
  });

  // La remise porte sur des montres toutes au taux normal : une ligne négative à ce taux.
  if (commande.discountCents > 0) {
    const tva = tvaIncluse(commande.discountCents);
    lignes.push({
      designation: `Remise${commande.discountCode ? ` (code ${commande.discountCode})` : ""}`,
      reference: null,
      quantite: 1,
      prixUnitaireHtCentimes: -(commande.discountCents - tva),
      tauxTvaPb: boutique.tauxTvaPb,
      totalHtCentimes: -(commande.discountCents - tva),
      totalTtcCentimes: -commande.discountCents,
    });
  }

  if (commande.shippingCents > 0) {
    const tva = tvaIncluse(commande.shippingCents);
    lignes.push({
      designation: `Livraison (${boutique.livraison.transporteur})`,
      reference: null,
      quantite: 1,
      prixUnitaireHtCentimes: commande.shippingCents - tva,
      tauxTvaPb: boutique.tauxTvaPb,
      totalHtCentimes: commande.shippingCents - tva,
      totalTtcCentimes: commande.shippingCents,
    });
  }

  const totalTtcCentimes = lignes.reduce((s, l) => s + l.totalTtcCentimes, 0);
  const totalHtCentimes = lignes.reduce((s, l) => s + l.totalHtCentimes, 0);
  return {
    lignes,
    totalHtCentimes,
    totalTvaCentimes: totalTtcCentimes - totalHtCentimes,
    totalTtcCentimes,
  };
}

const formateurDate = new Intl.DateTimeFormat(boutique.locale, {
  dateStyle: "long",
  timeZone: "Europe/Paris",
});

/** 14 octobre 2026, à l'heure de Paris. */
export function formatDate(date: Date): string {
  return formateurDate.format(date);
}
