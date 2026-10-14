// Génère les illustrations SVG des montres de test dans public/images/montres.
// Usage : npm run visuels
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { marques, montres } from "../prisma/donnees-test";
import { svgMontre, vuesMontre } from "../src/lib/visuels";

const dossier = join(process.cwd(), "public/images/montres");
mkdirSync(dossier, { recursive: true });

const nomsVues = { face: "vue de face", detail: "détail du cadran", profil: "vue de profil" };

for (const montre of montres) {
  const marque = marques.find((m) => m.slug === montre.marque)!;
  for (const vue of vuesMontre) {
    const svg = svgMontre(
      {
        cadran: montre.dialColor,
        boitier: montre.caseMaterial,
        bracelet: montre.strapType,
        couleurBracelet: montre.strapColor,
        date: montre.functions.includes("Date"),
        lunette: montre.functions.includes("Lunette tournante"),
      },
      vue,
      `${marque.name} ${montre.name}, ${nomsVues[vue]}`,
    );
    writeFileSync(join(dossier, `${montre.slug}-${vue}.svg`), svg);
  }
}

// Visuel du hero de l'accueil
writeFileSync(
  join(dossier, "hero.svg"),
  svgMontre(
    { cadran: "bleu", boitier: "ACIER", bracelet: "CUIR", couleurBracelet: "noir" },
    "face",
    "Montre à cadran bleu",
  ),
);

console.log(`${montres.length * vuesMontre.length + 1} illustrations générées dans ${dossier}`);
