import { describe, expect, it } from "vitest";
import {
  centimesEnSaisie,
  erreursParChamp,
  euroEnCentimes,
  lireFormulaireProduit,
  schemaProduit,
  slugifier,
} from "@/lib/admin/regles";

describe("saisies", () => {
  it("crée une adresse sans accents ni espaces", () => {
    expect(slugifier("Frédérique Constant  Été bleu")).toBe("frederique-constant-ete-bleu");
  });

  it("lit les montants à la française", () => {
    expect(euroEnCentimes("1 290,50 €")).toBe(129_050);
    expect(euroEnCentimes("1290.5")).toBe(129_050);
    expect(euroEnCentimes("12,345")).toBeNull();
    expect(euroEnCentimes("abc")).toBeNull();
    expect(centimesEnSaisie(129_050)).toBe("1290,50");
    expect(centimesEnSaisie(72_500)).toBe("725");
  });
});

describe("schemaProduit", () => {
  const formulaire = (modifs: Record<string, string> = {}) => {
    const f = new FormData();
    const base: Record<string, string> = {
      marqueId: "m1",
      nom: "PRX",
      slug: "",
      reference: "T137",
      statut: "PUBLISHED",
      resume: "Résumé",
      description: "Description",
      avisMaison: "",
      prix: "725",
      prixBarre: "",
      stock: "3",
      seuilStockBas: "2",
      delaiExpeditionJours: "2",
      garantieMois: "24",
      genre: "MIXTE",
      mouvement: "AUTOMATIQUE",
      calibre: "",
      reserveMarcheH: "",
      diametreMm: "40",
      epaisseurMm: "",
      entreCornesMm: "",
      matiereBoitier: "ACIER",
      bracelet: "ACIER",
      couleurBracelet: "",
      couleurCadran: "Bleu",
      etancheiteM: "100",
      verre: "",
      fonctions: "date, ",
      titreSeo: "",
      descriptionSeo: "",
      "photos.0.url": "/images/montres/prx.jpg",
      "photos.0.alt": "Cadran bleu",
      "photos.1.url": "",
      "photos.1.alt": "",
      ...modifs,
    };
    for (const [cle, valeur] of Object.entries(base)) f.append(cle, valeur);
    return f;
  };

  it("accepte une fiche complète et ignore les lignes de photo vides", () => {
    const r = schemaProduit.parse(lireFormulaireProduit(formulaire()));
    expect(r.prix).toBe(72_500);
    expect(r.couleurCadran).toBe("bleu");
    expect(r.fonctions).toEqual(["date"]);
    expect(r.photos).toHaveLength(1);
  });

  it("refuse un prix barré inférieur et une photo hors du site", () => {
    const r = schemaProduit.safeParse(
      lireFormulaireProduit(
        formulaire({ prixBarre: "500", "photos.0.url": "https://exemple.fr/a.jpg" }),
      ),
    );
    expect(r.success).toBe(false);
    const erreurs = erreursParChamp(r.error!);
    expect(erreurs.prixBarre).toBeDefined();
    expect(erreurs["photos.0.url"]).toBeDefined();
  });

  it("exige une photo pour publier, pas pour un brouillon", () => {
    const sansPhoto = { "photos.0.url": "", "photos.0.alt": "" };
    expect(schemaProduit.safeParse(lireFormulaireProduit(formulaire(sansPhoto))).success).toBe(
      false,
    );
    expect(
      schemaProduit.safeParse(lireFormulaireProduit(formulaire({ ...sansPhoto, statut: "DRAFT" })))
        .success,
    ).toBe(true);
  });
});
