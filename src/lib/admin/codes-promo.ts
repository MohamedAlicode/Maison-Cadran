// Lectures des codes promo pour le back-office.
import "server-only";
import { centimesEnSaisie, jourParis } from "@/lib/admin/regles";
import { db } from "@/lib/db";

export function listeCodesPromoAdmin() {
  return db.discountCode.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] });
}

/** Valeurs par défaut d'un nouveau code : actif, une utilisation par client. */
export const nouveauCode = { type: "PERCENT", parClient: "1", actif: "on" };

/** Code en saisies texte pour préremplir le formulaire. */
export async function codePourEdition(id: string) {
  const c = await db.discountCode.findUnique({ where: { id } });
  if (!c) return null;
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    valeur: c.type === "PERCENT" ? String(c.value) : centimesEnSaisie(c.value),
    montantMinimum: centimesEnSaisie(c.minOrderCents),
    utilisationsMax: c.maxUses === null ? "" : String(c.maxUses),
    parClient: c.perCustomerMax === null ? "" : String(c.perCustomerMax),
    debut: c.startsAt ? jourParis(c.startsAt) : "",
    // La fin est stockée à minuit le lendemain : on affiche le dernier jour valable.
    fin: c.endsAt ? jourParis(new Date(c.endsAt.getTime() - 1)) : "",
    actif: c.isActive ? "on" : "",
    banderole: c.showInBanner ? "on" : "",
    utilisations: c.usesCount,
  };
}
