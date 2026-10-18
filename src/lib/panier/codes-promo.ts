// Règles des codes promo, sans accès à la base : testables seules.
// Le code est revérifié à chaque affichage du panier et au départ vers le paiement.
import type { DiscountType } from "@/generated/prisma/enums";
import { formatPrixCourt } from "@/lib/prix";

export const COOKIE_CODE_PROMO = "mc_code";

export type CodePromo = {
  code: string;
  type: DiscountType;
  /** Pourcentage (10 = 10 %) ou montant en centimes. */
  value: number;
  minOrderCents: number | null;
  maxUses: number | null;
  usesCount: number;
  perCustomerMax: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

/** « bienvenue 10 » → « BIENVENUE10 » : les codes sont stockés en majuscules, sans espaces. */
export function normaliserCode(saisie: string) {
  return saisie.replace(/\s+/g, "").toUpperCase();
}

/** Remise en centimes, jamais supérieure au sous-total. */
export function montantRemise(code: Pick<CodePromo, "type" | "value">, sousTotalCentimes: number) {
  const remise =
    code.type === "PERCENT" ? Math.round((sousTotalCentimes * code.value) / 100) : code.value;
  return Math.min(remise, sousTotalCentimes);
}

/**
 * Raison pour laquelle le code ne s'applique pas, ou null s'il s'applique.
 * `usagesClient` : commandes payées du client connecté avec ce code (0 pour un invité).
 */
export function refusCode(
  code: CodePromo | null,
  {
    sousTotalCentimes,
    maintenant,
    usagesClient,
  }: { sousTotalCentimes: number; maintenant: Date; usagesClient: number },
): string | null {
  if (!code || !code.isActive) return "Ce code n'existe pas ou n'est plus valable.";
  if (code.startsAt && code.startsAt > maintenant) return "Ce code n'est pas encore valable.";
  if (code.endsAt && code.endsAt <= maintenant) return "Ce code a expiré.";
  if (code.maxUses !== null && code.usesCount >= code.maxUses) {
    return "Ce code a atteint son nombre d'utilisations.";
  }
  if (code.perCustomerMax !== null && usagesClient >= code.perCustomerMax) {
    return "Vous avez déjà utilisé ce code.";
  }
  if (code.minOrderCents !== null && sousTotalCentimes < code.minOrderCents) {
    return `Ce code s'applique dès ${formatPrixCourt(code.minOrderCents)} d'achat.`;
  }
  return null;
}

/** Phrase de la banderole : « −10 % avec le code BIENVENUE10 », « 50 € offerts dès 500 €… ». */
export function annonceCode(code: Pick<CodePromo, "code" | "type" | "value" | "minOrderCents">) {
  const offre =
    code.type === "PERCENT" ? `−${code.value} %` : `${formatPrixCourt(code.value)} offerts`;
  const seuil = code.minOrderCents ? ` dès ${formatPrixCourt(code.minOrderCents)} d'achat` : "";
  return `${offre}${seuil} avec le code ${code.code}`;
}
