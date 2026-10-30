import { describe, expect, it } from "vitest";
import { hacherMotDePasse, verifierMotDePasse } from "@/lib/compte/mot-de-passe";

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
