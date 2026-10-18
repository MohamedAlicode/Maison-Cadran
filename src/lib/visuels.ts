// Illustrations vectorielles de montres. Les produits ont désormais de vraies photos
// (prisma/photos-montres.ts) ; ce dessin ne sert plus qu'au visuel de l'accueil, produit par
// `npm run visuels` dans public/images/montres. Les teintes de cadran servent aussi aux pastilles
// de couleur de la fiche produit.

export type VueMontre = "face" | "detail" | "profil";

export type ApparenceMontre = {
  cadran: string; // clé normalisée (bleu, vert…)
  boitier: string; // enum CaseMaterial
  bracelet: string; // enum StrapType
  couleurBracelet?: string | null;
  /** Guichet de date à 3 heures. */
  date?: boolean;
  /** Lunette tournante de plongée. */
  lunette?: boolean;
};

export const teintesCadran: Record<string, string> = {
  bleu: "#1f3a5f",
  vert: "#2f5a46",
  noir: "#1d1f22",
  argente: "#d9d6cf",
  blanc: "#f2efe8",
  creme: "#ece3cf",
  gris: "#5f646b",
  marron: "#5a3a24",
  champagne: "#d8c49a",
};

const teintesBoitier: Record<string, string> = {
  ACIER: "#cfcac1",
  TITANE: "#a9a8a3",
  CERAMIQUE: "#26272a",
  OR: "#c9a86a",
  PLAQUE_OR: "#d4b26f",
  BRONZE: "#a7743f",
  AUTRE: "#bdb8b0",
};

const teintesBracelet: Record<string, string> = {
  noir: "#232120",
  marron: "#5a3a24",
  bleu: "#24324a",
  kaki: "#6b6a4f",
  gris: "#6f6d68",
  vert: "#2f4a3c",
};

/** Le cadran est-il clair ? (index et aiguilles foncés dans ce cas) */
function estClair(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const v = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * r + 0.7152 * v + 0.0722 * b > 150;
}

function couleurs(a: ApparenceMontre) {
  const cadran = teintesCadran[a.cadran] ?? teintesCadran.noir;
  const boitier = teintesBoitier[a.boitier] ?? teintesBoitier.ACIER;
  const metal = a.bracelet === "ACIER" || a.bracelet === "TITANE";
  const bracelet = metal
    ? a.bracelet === "TITANE"
      ? teintesBoitier.TITANE
      : boitier
    : (teintesBracelet[a.couleurBracelet ?? "noir"] ?? teintesBracelet.noir);
  const aiguilles = estClair(cadran) ? "#1c1b19" : "#f7f3ec";
  return { cadran, boitier, bracelet, aiguilles, metal };
}

/** Motif du bracelet : maillons pour le métal, surpiqûres pour le cuir, rayures pour le NATO. */
function motifBracelet(a: ApparenceMontre, x: number, y: number, l: number, h: number) {
  if (a.bracelet === "ACIER" || a.bracelet === "TITANE") {
    const lignes = [];
    for (let i = 8; i < h; i += 9) {
      lignes.push(
        `<line x1="${x}" y1="${y + i}" x2="${x + l}" y2="${y + i}" stroke="#000" stroke-opacity=".12"/>`,
      );
    }
    lignes.push(
      `<line x1="${x + l / 3}" y1="${y}" x2="${x + l / 3}" y2="${y + h}" stroke="#000" stroke-opacity=".08"/>`,
      `<line x1="${x + (2 * l) / 3}" y1="${y}" x2="${x + (2 * l) / 3}" y2="${y + h}" stroke="#000" stroke-opacity=".08"/>`,
    );
    return lignes.join("");
  }
  if (a.bracelet === "CUIR") {
    return `<rect x="${x + 4}" y="${y + 2}" width="${l - 8}" height="${h - 4}" fill="none" stroke="#f7f3ec" stroke-opacity=".35" stroke-dasharray="3 3"/>`;
  }
  if (a.bracelet === "NATO_TISSU") {
    return `<rect x="${x + l / 2 - 4}" y="${y}" width="8" height="${h}" fill="#f7f3ec" fill-opacity=".18"/>`;
  }
  // Caoutchouc : rainures horizontales
  const rainures = [];
  for (let i = 10; i < h; i += 12) {
    rainures.push(
      `<rect x="${x + 6}" y="${y + i}" width="${l - 12}" height="3" rx="1.5" fill="#000" fill-opacity=".18"/>`,
    );
  }
  return rainures.join("");
}

function vueFace(a: ApparenceMontre) {
  const c = couleurs(a);
  const index = Array.from({ length: 12 }, (_, i) => i * 30)
    .filter((angle) => !(a.date && angle === 90))
    .map(
      (angle) =>
        `<rect x="98.5" y="58" width="3" height="${angle % 90 === 0 ? 10 : 6}" fill="${c.aiguilles}" opacity=".9" transform="rotate(${angle} 100 100)"/>`,
    )
    .join("");
  return `
  <rect x="78" y="0" width="44" height="60" rx="4" fill="${c.bracelet}"/>${motifBracelet(a, 78, 0, 44, 60)}
  <rect x="78" y="140" width="44" height="60" rx="4" fill="${c.bracelet}"/>${motifBracelet(a, 78, 140, 44, 60)}
  <rect x="72" y="46" width="56" height="16" rx="3" fill="${c.boitier}"/>
  <rect x="72" y="138" width="56" height="16" rx="3" fill="${c.boitier}"/>
  <rect x="152" y="94" width="10" height="12" rx="2" fill="${c.boitier}"/>
  <circle cx="100" cy="100" r="54" fill="${c.boitier}"/>
  <circle cx="100" cy="100" r="54" fill="none" stroke="#000" stroke-opacity=".08"/>
  ${a.lunette ? lunetteTournante() : ""}
  <circle cx="100" cy="100" r="${a.lunette ? 41 : 47}" fill="${c.cadran}"/>
  ${a.lunette ? index.replaceAll('y="58"', 'y="63"') : index}
  ${a.date ? `<rect x="${a.lunette ? 120 : 124}" y="96.5" width="9" height="7" fill="#f7f3ec" stroke="#000" stroke-opacity=".15" stroke-width=".5"/>` : ""}
  <rect x="98.5" y="72" width="3" height="30" rx="1.5" fill="${c.aiguilles}" transform="rotate(-60 100 100)"/>
  <rect x="99" y="62" width="2" height="40" rx="1" fill="${c.aiguilles}" transform="rotate(60 100 100)"/>
  <rect x="99.5" y="60" width="1" height="48" fill="#b08d57" transform="rotate(200 100 100)"/>
  <circle cx="100" cy="100" r="3" fill="#b08d57"/>
  <ellipse cx="82" cy="78" rx="26" ry="12" fill="#fff" fill-opacity=".06" transform="rotate(-35 82 78)"/>`;
}

/** Lunette noire graduée (plongée), entre le boîtier et le cadran. */
function lunetteTournante() {
  const graduations = Array.from({ length: 12 }, (_, i) => i * 30)
    .map(
      (angle) =>
        `<rect x="99" y="${angle === 0 ? 48 : 49}" width="2" height="${angle === 0 ? 6 : 4}" fill="#f7f3ec" transform="rotate(${angle} 100 100)"/>`,
    )
    .join("");
  return `<circle cx="100" cy="100" r="51" fill="#1d1f22"/>${graduations}`;
}

function vueProfil(a: ApparenceMontre) {
  const c = couleurs(a);
  return `
  <path d="M30 112 C 30 150, 60 172, 100 172 C 140 172, 170 150, 170 112" fill="none" stroke="${c.bracelet}" stroke-width="14" stroke-linecap="round"/>
  <rect x="40" y="88" width="120" height="26" rx="8" fill="${c.boitier}"/>
  <rect x="40" y="88" width="120" height="26" rx="8" fill="none" stroke="#000" stroke-opacity=".1"/>
  <path d="M48 88 Q100 72 152 88 Z" fill="#dfe7ee" fill-opacity=".7" stroke="#000" stroke-opacity=".1"/>
  <rect x="160" y="94" width="12" height="14" rx="2" fill="${c.boitier}"/>
  <line x1="162" y1="96" x2="162" y2="106" stroke="#000" stroke-opacity=".2"/>
  <line x1="166" y1="96" x2="166" y2="106" stroke="#000" stroke-opacity=".2"/>
  <rect x="40" y="110" width="120" height="4" fill="#000" fill-opacity=".06"/>`;
}

/** Document SVG complet pour une vue donnée. */
export function svgMontre(a: ApparenceMontre, vue: VueMontre, label: string) {
  const viewBox = vue === "detail" ? "52 52 96 96" : "0 0 200 200";
  const contenu = vue === "profil" ? vueProfil(a) : vueFace(a);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="800" role="img" aria-label="${label}"><rect x="-10" y="-10" width="220" height="220" fill="#ffffff"/>${contenu}</svg>\n`;
}
