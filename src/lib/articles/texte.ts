// Texte des articles du guide : un sous-ensemble de Markdown, lu sans dépendance.
// Paragraphes séparés par une ligne vide, « ## » et « ### » pour les titres, « - » pour
// les listes, **gras** et [lien](/adresse). Rien n'est interprété comme du HTML.

export type Morceau =
  | { type: "texte"; texte: string }
  | { type: "gras"; texte: string }
  | { type: "lien"; texte: string; href: string };

export type Bloc =
  | { type: "titre"; niveau: 2 | 3; texte: string }
  | { type: "paragraphe"; morceaux: Morceau[] }
  | { type: "liste"; elements: Morceau[][] };

/** Seuls les liens internes et https sont gardés : un autre lien reste du texte. */
const motifEnLigne = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\/[^\s)]*|https:\/\/[^\s)]+)\)/g;

export function lireEnLigne(texte: string): Morceau[] {
  const morceaux: Morceau[] = [];
  let depuis = 0;
  for (const m of texte.matchAll(motifEnLigne)) {
    if (m.index > depuis) morceaux.push({ type: "texte", texte: texte.slice(depuis, m.index) });
    morceaux.push(
      m[1] !== undefined
        ? { type: "gras", texte: m[1] }
        : { type: "lien", texte: m[2], href: m[3] },
    );
    depuis = m.index + m[0].length;
  }
  if (depuis < texte.length) morceaux.push({ type: "texte", texte: texte.slice(depuis) });
  return morceaux;
}

export function lireArticle(contenu: string): Bloc[] {
  return contenu
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((bloc) => bloc.trim())
    .filter(Boolean)
    .map((bloc): Bloc => {
      const titre = /^(#{2,3})\s+(.+)$/.exec(bloc);
      if (titre && !bloc.includes("\n")) {
        return { type: "titre", niveau: titre[1].length as 2 | 3, texte: titre[2].trim() };
      }
      const lignes = bloc.split("\n").map((l) => l.trim());
      if (lignes.every((l) => l.startsWith("- "))) {
        return { type: "liste", elements: lignes.map((l) => lireEnLigne(l.slice(2).trim())) };
      }
      return { type: "paragraphe", morceaux: lireEnLigne(lignes.join(" ")) };
    });
}
