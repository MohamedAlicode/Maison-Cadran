// Hachage des mots de passe avec scrypt (node:crypto) : lent et gourmand en mémoire, il rend
// coûteux le test de millions de mots de passe si la base fuit. Aucune dépendance ajoutée.
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Paramètres recommandés par l'OWASP pour scrypt (N = 2^17, r = 8, p = 1) : environ 128 Mo
// et une centaine de millisecondes par calcul. Ils sont écrits dans chaque empreinte pour
// pouvoir être relevés plus tard sans invalider les anciens mots de passe.
const PARAMETRES = { N: 2 ** 17, r: 8, p: 1 };
const LONGUEUR_CLE = 64;

function deriver(motDePasse: string, sel: Buffer, { N, r, p }: typeof PARAMETRES) {
  const options: ScryptOptions = { N, r, p, maxmem: 256 * N * r };
  return new Promise<Buffer>((resoudre, rejeter) =>
    scrypt(motDePasse.normalize("NFKC"), sel, LONGUEUR_CLE, options, (erreur, cle) =>
      erreur ? rejeter(erreur) : resoudre(cle),
    ),
  );
}

/** Empreinte stockée en base : « scrypt$N$r$p$sel$cle », sel et clé en base64. */
export async function hacherMotDePasse(motDePasse: string) {
  const sel = randomBytes(16);
  const cle = await deriver(motDePasse, sel, PARAMETRES);
  const { N, r, p } = PARAMETRES;
  return ["scrypt", N, r, p, sel.toString("base64"), cle.toString("base64")].join("$");
}

export async function verifierMotDePasse(motDePasse: string, empreinte: string) {
  const [algo, N, r, p, sel, cle] = empreinte.split("$");
  if (algo !== "scrypt" || !sel || !cle) return false;
  const attendue = Buffer.from(cle, "base64");
  const calculee = await deriver(motDePasse, Buffer.from(sel, "base64"), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  // Comparaison en temps constant : la durée ne trahit pas combien d'octets concordent.
  return calculee.length === attendue.length && timingSafeEqual(calculee, attendue);
}

// Empreinte d'un mot de passe jetable, comparée quand l'adresse n'a pas de compte : la réponse
// prend alors autant de temps, et sa durée ne dit pas si l'adresse est inscrite.
let empreinteFactice: Promise<string> | undefined;
export function empreinteLeurre() {
  empreinteFactice ??= hacherMotDePasse(randomBytes(16).toString("hex"));
  return empreinteFactice;
}
