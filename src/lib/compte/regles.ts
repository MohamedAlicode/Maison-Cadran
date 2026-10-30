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

/** Règles d'un nouveau mot de passe, affichées et cochées pendant la saisie de l'inscription. */
export const reglesMotDePasse = [
  { libelle: "12 caractères au minimum", respectee: (v: string) => v.length >= 12 },
  { libelle: "Une majuscule", respectee: (v: string) => /\p{Lu}/u.test(v) },
  // Tout ce qui n'est ni une lettre, ni un chiffre, ni une espace : ! ? @ # - _ …
  {
    libelle: "Un caractère spécial (! ? @ # …)",
    respectee: (v: string) => /[^\p{L}\p{N}\s]/u.test(v),
  },
];

const email = z.email("Indiquez une adresse e-mail valide.").trim().toLowerCase();

export const schemaInscription = z.object({
  email,
  motDePasse: z
    .string()
    .max(128, "128 caractères au maximum.")
    .refine((v) => reglesMotDePasse.every((regle) => regle.respectee(v)), {
      message: "Le mot de passe ne respecte pas toutes les règles ci-dessus.",
    }),
});

// À la connexion, aucune règle de forme : seul compte le mot de passe enregistré.
export const schemaConnexion = z.object({
  email,
  motDePasse: z.string().min(1, "Indiquez votre mot de passe.").max(128),
});

/** Après 5 essais manqués, le compte refuse tout mot de passe pendant 15 minutes. */
export const ESSAIS_MAX = 5;
export const BLOCAGE_MS = 15 * 60 * 1000;
