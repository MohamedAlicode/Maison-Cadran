import { describe, expect, it } from "vitest";
import {
  LIGNES_MAX,
  QUANTITE_MAX_PAR_MONTRE,
  ajouterUn,
  calculerMontants,
  changerQuantiteLigne,
  ecrireContenu,
  lireContenu,
  quantiteMax,
} from "@/lib/panier/regles";

const A = "cmg1aaaaaaaaaaaaaaaaaaaaa";
const B = "cmg1bbbbbbbbbbbbbbbbbbbbb";

describe("cookie du panier", () => {
  it("relit ce qu'il a écrit", () => {
    const lignes = [
      { id: A, quantite: 2 },
      { id: B, quantite: 1 },
    ];
    expect(lireContenu(ecrireContenu(lignes))).toEqual(lignes);
  });

  it("donne un panier vide pour un cookie absent ou abîmé", () => {
    expect(lireContenu(undefined)).toEqual([]);
    expect(lireContenu("n'importe quoi")).toEqual([]);
  });

  it("ignore les lignes trafiquées et garde les autres", () => {
    expect(lireContenu(`${A}:2|${B}:999|pas-un-id:1|${A}:1|${B}:-3`)).toEqual([
      { id: A, quantite: 2 },
    ]);
  });

  it(`limite le panier à ${LIGNES_MAX} montres`, () => {
    const valeur = Array.from({ length: 30 }, (_, i) => `cmg1${String(i).padStart(21, "x")}:1`);
    expect(lireContenu(valeur.join("|"))).toHaveLength(LIGNES_MAX);
  });
});

describe("modifications du panier", () => {
  it("ajoute une montre en tête, ou augmente sa quantité", () => {
    const panier = ajouterUn([{ id: A, quantite: 1 }], B);
    expect(panier).toEqual([
      { id: B, quantite: 1 },
      { id: A, quantite: 1 },
    ]);
    expect(ajouterUn(panier, A)[0]).toEqual({ id: A, quantite: 2 });
  });

  it(`ne dépasse jamais ${QUANTITE_MAX_PAR_MONTRE} exemplaires`, () => {
    expect(ajouterUn([{ id: A, quantite: QUANTITE_MAX_PAR_MONTRE }], A)[0].quantite).toBe(
      QUANTITE_MAX_PAR_MONTRE,
    );
    expect(quantiteMax(10)).toBe(QUANTITE_MAX_PAR_MONTRE);
    expect(quantiteMax(1)).toBe(1);
    expect(quantiteMax(-2)).toBe(0);
  });

  it("change une quantité sans déplacer la ligne, et retire à zéro", () => {
    const panier = [
      { id: A, quantite: 1 },
      { id: B, quantite: 1 },
    ];
    expect(changerQuantiteLigne(panier, B, 2)).toEqual([
      { id: A, quantite: 1 },
      { id: B, quantite: 2 },
    ]);
    expect(changerQuantiteLigne(panier, A, 0)).toEqual([{ id: B, quantite: 1 }]);
  });
});

describe("calculerMontants", () => {
  it("facture la livraison sous 150 € et l'inclut dans la TVA", () => {
    const m = calculerMontants([{ prixCentimes: 12_000, tauxTvaPb: 2000, quantite: 1 }]);
    expect(m.sousTotalCentimes).toBe(12_000);
    expect(m.livraisonCentimes).toBe(990);
    expect(m.totalCentimes).toBe(12_990);
    expect(m.tvaCentimes).toBe(2_000 + 165);
    expect(m.resteAvantLivraisonOfferteCentimes).toBe(3_000);
    expect(m.nombreArticles).toBe(1);
  });

  it("offre la livraison dès 150 €", () => {
    const m = calculerMontants([{ prixCentimes: 72_500, tauxTvaPb: 2000, quantite: 2 }]);
    expect(m.livraisonCentimes).toBe(0);
    expect(m.totalCentimes).toBe(145_000);
    expect(m.resteAvantLivraisonOfferteCentimes).toBe(0);
    expect(m.nombreArticles).toBe(2);
  });

  it("déduit la remise avant de juger la livraison offerte", () => {
    const m = calculerMontants([{ prixCentimes: 16_000, tauxTvaPb: 2000, quantite: 1 }], 2_000);
    expect(m.remiseCentimes).toBe(2_000);
    expect(m.livraisonCentimes).toBe(990);
    expect(m.totalCentimes).toBe(14_990);
    expect(m.tvaCentimes).toBe(2_667 - 333 + 165);
    expect(m.resteAvantLivraisonOfferteCentimes).toBe(1_000);
  });

  it("ne remise jamais plus que le sous-total", () => {
    expect(
      calculerMontants([{ prixCentimes: 5_000, tauxTvaPb: 2000, quantite: 1 }], 9_000),
    ).toMatchObject({
      remiseCentimes: 5_000,
      livraisonCentimes: 0,
      totalCentimes: 0,
    });
  });

  it("vaut zéro pour un panier vide", () => {
    expect(calculerMontants([])).toMatchObject({
      totalCentimes: 0,
      livraisonCentimes: 0,
      resteAvantLivraisonOfferteCentimes: 0,
    });
  });
});
