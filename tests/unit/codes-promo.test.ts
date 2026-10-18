import { describe, expect, it } from "vitest";
import {
  annonceCode,
  montantRemise,
  normaliserCode,
  refusCode,
  type CodePromo,
} from "@/lib/panier/codes-promo";

const code: CodePromo = {
  code: "BIENVENUE10",
  type: "PERCENT",
  value: 10,
  minOrderCents: 20_000,
  maxUses: 100,
  usesCount: 3,
  perCustomerMax: 1,
  startsAt: new Date("2026-10-01"),
  endsAt: new Date("2026-12-31"),
  isActive: true,
};
const contexte = { sousTotalCentimes: 72_500, maintenant: new Date("2026-10-18"), usagesClient: 0 };

describe("codes promo", () => {
  it("normalise la saisie", () => {
    expect(normaliserCode(" bienvenue 10 ")).toBe("BIENVENUE10");
  });

  it("calcule la remise sans dépasser le sous-total", () => {
    expect(montantRemise(code, 72_550)).toBe(7_255);
    expect(montantRemise({ type: "FIXED", value: 5_000 }, 3_000)).toBe(3_000);
  });

  it("accepte un code valable et explique chaque refus", () => {
    expect(refusCode(code, contexte)).toBeNull();
    expect(refusCode(null, contexte)).toMatch(/n'existe pas/);
    expect(refusCode({ ...code, isActive: false }, contexte)).toMatch(/n'existe pas/);
    expect(refusCode(code, { ...contexte, maintenant: new Date("2026-09-01") })).toMatch(
      /pas encore/,
    );
    expect(refusCode(code, { ...contexte, maintenant: new Date("2027-01-01") })).toMatch(/expiré/);
    expect(refusCode({ ...code, usesCount: 100 }, contexte)).toMatch(/nombre d'utilisations/);
    expect(refusCode(code, { ...contexte, usagesClient: 1 })).toMatch(/déjà utilisé/);
    expect(refusCode(code, { ...contexte, sousTotalCentimes: 15_000 })).toMatch(/dès 200/);
  });

  it("annonce l'offre dans la banderole", () => {
    expect(annonceCode(code)).toMatch(/^−10 % dès 200\s€ d'achat avec le code BIENVENUE10$/);
    expect(annonceCode({ ...code, type: "FIXED", value: 5_000, minOrderCents: null })).toMatch(
      /^50\s€ offerts avec le code BIENVENUE10$/,
    );
  });
});
