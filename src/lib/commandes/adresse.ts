// Adresses figées dans la commande (champ JSON), validées par Zod à l'écriture comme à la lecture.
import type Stripe from "stripe";
import { z } from "zod";

export const schemaAdresse = z.object({
  nom: z.string(),
  ligne1: z.string(),
  ligne2: z.string().nullable(),
  codePostal: z.string(),
  ville: z.string(),
  pays: z.string(),
  telephone: z.string().nullable(),
});

export type Adresse = z.infer<typeof schemaAdresse>;

/** Convertit une adresse Stripe ; null si elle est incomplète. */
export function adresseDepuisStripe(
  nom: string | null | undefined,
  adresse: Stripe.Address | null | undefined,
  telephone: string | null | undefined,
): Adresse | null {
  const resultat = schemaAdresse.safeParse({
    nom: nom ?? "",
    ligne1: adresse?.line1,
    ligne2: adresse?.line2 ?? null,
    codePostal: adresse?.postal_code,
    ville: adresse?.city,
    pays: adresse?.country,
    telephone: telephone ?? null,
  });
  return resultat.success ? resultat.data : null;
}

/** Lit une adresse stockée en JSON ; null si absente ou illisible. */
export function lireAdresse(valeur: unknown): Adresse | null {
  const resultat = schemaAdresse.safeParse(valeur);
  return resultat.success ? resultat.data : null;
}
