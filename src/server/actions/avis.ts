"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

type Champ = "note" | "prenom" | "email" | "texte";

export type EtatAvis =
  | { ok: true }
  | {
      ok: false;
      message: string;
      erreurs?: Partial<Record<Champ, string>>;
      // Renvoyées pour réafficher la saisie : React vide le formulaire après chaque envoi.
      valeurs: Record<string, string>;
    }
  | null;

const schemaAvis = z.object({
  produitId: z.cuid(),
  note: z.coerce
    .number({ error: "Choisissez une note." })
    .int()
    .min(1, "Choisissez une note.")
    .max(5),
  prenom: z.string().trim().min(2, "Indiquez votre prénom.").max(40),
  email: z.email("Indiquez une adresse e-mail valide."),
  titre: z.string().trim().max(80),
  texte: z.string().trim().min(20, "Écrivez au moins 20 caractères.").max(2000),
});

/**
 * Dépôt d'un avis, publié aussitôt : la modération arrivera avec l'espace d'administration.
 * Sans comptes clients, l'e-mail identifie l'auteur : un seul avis par montre et par adresse,
 * rattaché au compte que cette adresse ouvrira plus tard.
 */
export async function deposerAvis(_etat: EtatAvis, formulaire: FormData): Promise<EtatAvis> {
  const valeurs = Object.fromEntries([...formulaire].map(([cle, valeur]) => [cle, String(valeur)]));
  const saisie = schemaAvis.safeParse(valeurs);
  if (!saisie.success) {
    const { fieldErrors } = z.flattenError(saisie.error);
    return {
      ok: false,
      message: "Certains champs sont à corriger.",
      erreurs: {
        note: fieldErrors.note?.[0],
        prenom: fieldErrors.prenom?.[0],
        email: fieldErrors.email?.[0],
        texte: fieldErrors.texte?.[0],
      },
      valeurs,
    };
  }
  const { produitId, note, prenom, titre, texte } = saisie.data;
  const email = saisie.data.email.toLowerCase();

  const produit = await db.product.findFirst({
    where: { id: produitId, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!produit) return { ok: false, message: "Cette montre est introuvable.", valeurs };

  const auteur = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: prenom },
  });
  const dejaDonne = await db.review.findUnique({
    where: { productId_userId: { productId: produit.id, userId: auteur.id } },
    select: { id: true },
  });
  if (dejaDonne) {
    return { ok: false, message: "Vous avez déjà donné votre avis sur cette montre.", valeurs };
  }

  await db.review.create({
    data: {
      productId: produit.id,
      userId: auteur.id,
      rating: note,
      title: titre || null,
      body: texte,
      status: "APPROVED",
    },
  });
  // La note compte aussi pour « Les plus appréciées » de l'accueil, d'où tout le catalogue.
  updateTag("catalogue");
  return { ok: true };
}
