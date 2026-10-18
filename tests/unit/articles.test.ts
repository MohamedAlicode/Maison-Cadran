import { describe, expect, it } from "vitest";
import { lireArticle, lireEnLigne } from "@/lib/articles/texte";

describe("texte des articles", () => {
  it("découpe titres, listes et paragraphes", () => {
    const blocs = lireArticle(
      "Premier paragraphe\nsur deux lignes.\n\n## Le mouvement\n\n- quartz\n- automatique\n\n### Détail",
    );
    expect(blocs.map((b) => b.type)).toEqual(["paragraphe", "titre", "liste", "titre"]);
    expect(blocs[0]).toEqual({
      type: "paragraphe",
      morceaux: [{ type: "texte", texte: "Premier paragraphe sur deux lignes." }],
    });
    expect(blocs[1]).toEqual({ type: "titre", niveau: 2, texte: "Le mouvement" });
  });

  it("lit le gras et les liens sûrs, et laisse le reste en texte", () => {
    expect(lireEnLigne("Un **saphir** et [nos montres](/montres).")).toEqual([
      { type: "texte", texte: "Un " },
      { type: "gras", texte: "saphir" },
      { type: "texte", texte: " et " },
      { type: "lien", texte: "nos montres", href: "/montres" },
      { type: "texte", texte: "." },
    ]);
    expect(lireEnLigne("[piège](javascript:alert(1)) <b>")).toEqual([
      { type: "texte", texte: "[piège](javascript:alert(1)) <b>" },
    ]);
  });
});
