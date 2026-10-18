// Règles pures de l'espace client, testées sans base ni session.
import { z } from "zod";

/**
 * Page où revenir après la connexion. Seul un chemin interne est accepté : une adresse
 * externe (« //site.fr », « https:// ») ferait du lien de connexion un tremplin vers un autre site.
 */
export function cheminRetour(valeur: unknown, parDefaut = "/compte") {
  if (typeof valeur !== "string" || !valeur.startsWith("/")) return parDefaut;
  if (valeur.startsWith("//") || valeur.startsWith("/\\")) return parDefaut;
  return valeur;
}

const texte = (message: string, max = 80) => z.string().trim().min(1, message).max(max);
const facultatif = (max = 80) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

/** Livraison en France métropolitaine seulement : les codes 97 et 98 (outre-mer) sont refusés. */
export const schemaAdresseCompte = z.object({
  libelle: facultatif(40),
  prenom: texte("Indiquez le prénom."),
  nom: texte("Indiquez le nom."),
  societe: facultatif(),
  ligne1: texte("Indiquez l'adresse.", 120),
  ligne2: facultatif(120),
  codePostal: z
    .string()
    .trim()
    .regex(/^(?!9[78])\d{5}$/, "Indiquez un code postal de France métropolitaine."),
  ville: texte("Indiquez la ville."),
  telephone: z
    .string()
    .trim()
    .regex(
      /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/,
      "Indiquez un numéro de téléphone français, utile au livreur.",
    )
    // Rangé en « 06 12 34 56 78 », quelle que soit la saisie, pour que le livreur le lise d'un coup d'œil.
    .transform((v) =>
      v
        .replace(/^\+33/, "0")
        .replace(/\D/g, "")
        .replace(/(\d{2})(?=\d)/g, "$1 "),
    ),
  parDefaut: z
    .literal("on")
    .optional()
    .transform((v) => v === "on"),
});

export type AdresseCompte = z.infer<typeof schemaAdresseCompte>;
