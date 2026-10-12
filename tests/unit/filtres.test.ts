import { describe, expect, it } from "vitest";
import {
  calculerFacettes,
  correspond,
  lireFiltres,
  rechercher,
  versQueryString,
  type ProduitIndexe,
} from "@/lib/filtres";

function produit(champs: Partial<ProduitIndexe>): ProduitIndexe {
  return {
    id: champs.slug ?? "x",
    slug: "x",
    marqueSlug: "tissot",
    marqueNom: "Tissot",
    nom: "Test",
    detail: "",
    prixCentimes: 50_000,
    prixBarreCentimes: null,
    genre: "HOMME",
    mouvement: "AUTOMATIQUE",
    diametreMm: 40,
    boitier: "ACIER",
    bracelet: "CUIR",
    cadran: "bleu",
    etancheiteM: 100,
    stock: 3,
    creeLe: 0,
    nouveau: false,
    image: null,
    imageSurvol: null,
    ...champs,
  };
}

const catalogue = [
  produit({ slug: "prx", prixCentimes: 72_500, creeLe: 3, bracelet: "ACIER" }),
  produit({
    slug: "bambino",
    marqueSlug: "orient",
    marqueNom: "Orient",
    prixCentimes: 18_900,
    cadran: "creme",
    etancheiteM: 30,
    creeLe: 1,
  }),
  produit({
    slug: "diver",
    marqueSlug: "citizen",
    marqueNom: "Citizen",
    prixCentimes: 24_900,
    mouvement: "SOLAIRE",
    diametreMm: 44,
    etancheiteM: 200,
    creeLe: 2,
  }),
  produit({
    slug: "lady",
    genre: "FEMME",
    prixCentimes: 37_500,
    mouvement: "QUARTZ",
    diametreMm: 35,
    creeLe: 4,
    stock: 0,
  }),
  produit({
    slug: "field",
    marqueSlug: "hamilton",
    marqueNom: "Hamilton",
    genre: "MIXTE",
    prixCentimes: 59_500,
    mouvement: "MANUEL",
    diametreMm: 38,
    creeLe: 5,
  }),
];

describe("lireFiltres", () => {
  it("lit les listes séparées par des virgules et ignore les valeurs invalides", () => {
    const f = lireFiltres({ marque: "Tissot, seiko,<script>", tri: "inconnu", page: "abc" });
    expect(f.marque).toEqual(["tissot", "seiko"]);
    expect(f.tri).toBe("selection");
    expect(f.page).toBe(1);
    expect(f.cadran).toEqual([]);
  });
});

describe("versQueryString", () => {
  it("produit une URL stable, sans valeurs par défaut", () => {
    const f = lireFiltres({ mouvement: "quartz,automatique", marque: "tissot" });
    expect(versQueryString(f)).toBe("?marque=tissot&mouvement=automatique,quartz");
    expect(versQueryString(lireFiltres({}))).toBe("");
  });
});

describe("correspond", () => {
  it("combine les filtres (ET entre filtres, OU dans un filtre)", () => {
    const f = lireFiltres({ marque: "tissot,orient", prix: "moins-300" });
    const r = catalogue.filter((p) => correspond(p, f)).map((p) => p.slug);
    expect(r).toEqual(["bambino"]);
  });

  it("inclut les montres mixtes dans les recherches homme et femme", () => {
    const femme = catalogue
      .filter((p) => correspond(p, lireFiltres({ genre: "femme" })))
      .map((p) => p.slug);
    expect(femme).toEqual(["lady", "field"]);
  });

  it("filtre par tranches de diamètre et d'étanchéité", () => {
    expect(
      catalogue
        .filter((p) => correspond(p, lireFiltres({ diametre: "plus-42" })))
        .map((p) => p.slug),
    ).toEqual(["diver"]);
    expect(
      catalogue
        .filter((p) => correspond(p, lireFiltres({ etancheite: "plongee" })))
        .map((p) => p.slug),
    ).toEqual(["diver"]);
  });
});

describe("rechercher", () => {
  it("trie par prix croissant", () => {
    const r = rechercher(catalogue, lireFiltres({ tri: "prix-croissant" }));
    expect(r.produits.map((p) => p.slug)).toEqual(["bambino", "diver", "lady", "field", "prx"]);
  });

  it("met les montres disponibles en premier dans la sélection", () => {
    const r = rechercher(catalogue, lireFiltres({}));
    expect(r.produits.at(-1)?.slug).toBe("lady");
    expect(r.produits[0].slug).toBe("field");
  });
});

describe("calculerFacettes", () => {
  it("compte les résultats de chaque option en tenant compte des autres filtres", () => {
    const facettes = calculerFacettes(catalogue, lireFiltres({ mouvement: "automatique" }));
    const marques = facettes.find((f) => f.cle === "marque")!.options;
    expect(marques.find((o) => o.valeur === "tissot")?.compte).toBe(1);
    expect(marques.find((o) => o.valeur === "citizen")).toBeUndefined();
    // Le filtre lui-même ignore sa propre sélection : on voit les autres mouvements disponibles.
    const mouvements = facettes.find((f) => f.cle === "mouvement")!.options;
    expect(mouvements.find((o) => o.valeur === "quartz")?.compte).toBe(1);
    expect(mouvements.find((o) => o.valeur === "automatique")?.actif).toBe(true);
  });
});
