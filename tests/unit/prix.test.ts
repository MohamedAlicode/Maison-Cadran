import { describe, expect, it } from "vitest";
import {
  formatPrix,
  formatPrixCourt,
  fraisLivraison,
  resteAvantLivraisonOfferte,
  tvaIncluse,
} from "@/lib/prix";

// Intl utilise des espaces insécables : on les normalise pour comparer.
const normaliser = (s: string) => s.replace(/\s/g, " ");

describe("formatPrix", () => {
  it("formate en euros à la française", () => {
    expect(normaliser(formatPrix(129_000))).toBe("1 290,00 €");
    expect(normaliser(formatPrix(990))).toBe("9,90 €");
  });

  it("supprime les décimales des montants ronds en format court", () => {
    expect(normaliser(formatPrixCourt(129_000))).toBe("1 290 €");
    expect(normaliser(formatPrixCourt(129_050))).toBe("1 290,50 €");
  });
});

describe("tvaIncluse", () => {
  it("extrait 20 % de TVA d'un prix TTC", () => {
    expect(tvaIncluse(12_000)).toBe(2_000);
    expect(tvaIncluse(72_500)).toBe(12_083);
  });

  it("vaut zéro pour un montant nul", () => {
    expect(tvaIncluse(0)).toBe(0);
  });
});

describe("fraisLivraison", () => {
  it("est offerte à partir du seuil", () => {
    expect(fraisLivraison(15_000)).toBe(0);
    expect(fraisLivraison(89_000)).toBe(0);
  });

  it("est facturée sous le seuil", () => {
    expect(fraisLivraison(14_999)).toBe(990);
  });

  it("est nulle pour un panier vide", () => {
    expect(fraisLivraison(0)).toBe(0);
  });
});

describe("resteAvantLivraisonOfferte", () => {
  it("calcule le montant manquant", () => {
    expect(resteAvantLivraisonOfferte(11_800)).toBe(3_200);
    expect(resteAvantLivraisonOfferte(20_000)).toBe(0);
  });
});
