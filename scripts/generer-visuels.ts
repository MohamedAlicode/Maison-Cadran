// Génère le visuel SVG du hero de l'accueil dans public/images/montres.
// Les produits ont de vraies photos : voir prisma/photos-montres.ts.
// Usage : npm run visuels
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { svgMontre } from "../src/lib/visuels";

const dossier = join(process.cwd(), "public/images/montres");
mkdirSync(dossier, { recursive: true });

writeFileSync(
  join(dossier, "hero.svg"),
  svgMontre(
    { cadran: "bleu", boitier: "ACIER", bracelet: "CUIR", couleurBracelet: "noir" },
    "face",
    "Montre à cadran bleu",
  ),
);

console.log(`Visuel du hero généré dans ${dossier}`);
