import { describe, expect, it } from "vitest";
import { cheminRetour, schemaAdresseCompte } from "@/lib/compte/regles";

describe("cheminRetour", () => {
  it("garde un chemin interne, avec sa requête", () => {
    expect(cheminRetour("/compte/favoris")).toBe("/compte/favoris");
    expect(cheminRetour("/montres?marque=seiko")).toBe("/montres?marque=seiko");
  });

  it("refuse les adresses externes et les valeurs inattendues", () => {
    for (const valeur of [
      "https://exemple.fr",
      "//exemple.fr",
      "/\\exemple.fr",
      "compte",
      "",
      null,
      ["/compte"],
    ]) {
      expect(cheminRetour(valeur)).toBe("/compte");
    }
  });
});

describe("schemaAdresseCompte", () => {
  const adresse = {
    libelle: "",
    prenom: "Camille",
    nom: "Martin",
    societe: "",
    ligne1: "12 rue des Horlogers",
    ligne2: "",
    codePostal: "75003",
    ville: "Paris",
    telephone: "06 12 34 56 78",
  };

  it("accepte une adresse de France métropolitaine et vide les champs facultatifs", () => {
    const resultat = schemaAdresseCompte.parse({ ...adresse, parDefaut: "on" });
    expect(resultat.societe).toBeNull();
    expect(resultat.parDefaut).toBe(true);
    expect(schemaAdresseCompte.parse(adresse).parDefaut).toBe(false);
  });

  it("accepte la Corse et range le téléphone, même saisi au format international", () => {
    const resultat = schemaAdresseCompte.parse({
      ...adresse,
      codePostal: "20000",
      telephone: "+33612345678",
    });
    expect(resultat.telephone).toBe("06 12 34 56 78");
    expect(schemaAdresseCompte.parse({ ...adresse, telephone: "06.12.34.56.78" }).telephone).toBe(
      "06 12 34 56 78",
    );
  });

  it("refuse l'outre-mer et un téléphone incomplet", () => {
    expect(schemaAdresseCompte.safeParse({ ...adresse, codePostal: "97400" }).success).toBe(false);
    expect(schemaAdresseCompte.safeParse({ ...adresse, telephone: "06 12 34" }).success).toBe(
      false,
    );
  });
});
