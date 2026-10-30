import { describe, expect, it } from "vitest";
import { hacherMotDePasse, verifierMotDePasse } from "@/lib/compte/mot-de-passe";
import { schemaConnexion, schemaInscription } from "@/lib/compte/regles";

describe("mots de passe", () => {
  it("ne stocke jamais le mot de passe en clair, et salé : deux empreintes diffèrent", async () => {
    const [a, b] = await Promise.all([
      hacherMotDePasse("Montre-2026"),
      hacherMotDePasse("Montre-2026"),
    ]);
    expect(a).not.toContain("Montre-2026");
    expect(a).toMatch(/^scrypt\$131072\$8\$1\$/);
    expect(a).not.toBe(b);
  });

  it("reconnaît le bon mot de passe et refuse les autres", async () => {
    const empreinte = await hacherMotDePasse("Montre-2026");
    expect(await verifierMotDePasse("Montre-2026", empreinte)).toBe(true);
    expect(await verifierMotDePasse("montre-2026", empreinte)).toBe(false);
    expect(await verifierMotDePasse("", empreinte)).toBe(false);
  });

  it("refuse une empreinte mal formée sans lever d'erreur", async () => {
    expect(await verifierMotDePasse("Montre-2026", "bidon")).toBe(false);
  });
});

describe("règles d'un nouveau mot de passe", () => {
  const essayer = (motDePasse: string) =>
    schemaInscription.safeParse({ email: "camille@exemple.fr", motDePasse }).success;

  it("exige 12 caractères, une majuscule et un caractère spécial", () => {
    expect(essayer("Cadran-bleu-1")).toBe(true);
    expect(essayer("Cadran-bleu")).toBe(false); // 11 caractères
    expect(essayer("cadran-bleu-1")).toBe(false); // pas de majuscule
    expect(essayer("Cadran bleu 12")).toBe(false); // l'espace ne compte pas comme caractère spécial
  });

  it("reconnaît les majuscules accentuées", () => {
    expect(essayer("Été-à-Genève!")).toBe(true);
  });

  it("n'applique aucune règle de forme à la connexion", () => {
    expect(
      schemaConnexion.safeParse({ email: "camille@exemple.fr", motDePasse: "court" }).success,
    ).toBe(true);
  });
});
