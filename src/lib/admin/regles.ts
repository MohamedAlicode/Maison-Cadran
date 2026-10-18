// Règles pures du back-office : validation des formulaires, testée sans base ni session.
import { z } from "zod";
import {
  CaseMaterial,
  Gender,
  Movement,
  type OrderStatus,
  ProductStatus,
  StrapType,
} from "@/generated/prisma/enums";

/** « Tissot PRX Powermatic 80 » → « tissot-prx-powermatic-80 » (accents retirés). */
export function slugifier(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Montant saisi en euros (« 1 290,50 », « 1290.5 ») → centimes. null si la saisie n'est pas un montant. */
export function euroEnCentimes(saisie: string): number | null {
  const nettoye = saisie.replace(/[\s  €]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(nettoye)) return null;
  return Math.round(Number(nettoye) * 100);
}

/** Centimes → saisie en euros pour préremplir un champ : 129050 → « 1290,50 ». */
export function centimesEnSaisie(centimes: number | null | undefined) {
  if (centimes === null || centimes === undefined) return "";
  return (centimes / 100).toFixed(2).replace(".", ",").replace(",00", "");
}

const texte = (message: string, max = 120) => z.string().trim().min(1, message).max(max);
const facultatif = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);
const entier = (message: string, min = 0, max = 100_000) =>
  z.coerce.number({ error: message }).int(message).min(min, message).max(max, message);
const entierFacultatif = (message: string, max = 10_000) =>
  z
    .string()
    .trim()
    .transform((v, ctx) => {
      if (!v) return null;
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0 || n > max) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      return n;
    });
/** Nombre décimal saisi à la française (« 40,5 »), entre 0 et 100 exclus, au dixième. */
function lireMillimetres(v: string) {
  const n = Number(v.replace(",", "."));
  return v && Number.isFinite(n) && n > 0 && n < 100 ? Math.round(n * 10) / 10 : null;
}
const millimetres = (message: string) =>
  z
    .string()
    .trim()
    .transform(
      (v, ctx) => lireMillimetres(v) ?? (ctx.addIssue({ code: "custom", message }), z.NEVER),
    );
const millimetresFacultatifs = (message: string) =>
  z
    .string()
    .trim()
    .transform((v, ctx) =>
      !v ? null : (lireMillimetres(v) ?? (ctx.addIssue({ code: "custom", message }), z.NEVER)),
    );

function lireMontant(v: string) {
  const centimes = euroEnCentimes(v);
  return centimes !== null && centimes > 0 ? centimes : null;
}
const montant = (message: string) =>
  z
    .string()
    .trim()
    .transform((v, ctx) => lireMontant(v) ?? (ctx.addIssue({ code: "custom", message }), z.NEVER));
const montantFacultatif = (message: string) =>
  z
    .string()
    .trim()
    .transform((v, ctx) =>
      !v ? null : (lireMontant(v) ?? (ctx.addIssue({ code: "custom", message }), z.NEVER)),
    );

/**
 * Photos acceptées : fichiers du site (/images/…) ou Cloudinary. Next n'optimise que les
 * domaines déclarés : une adresse d'un autre site casserait la fiche.
 */
export const motifPhoto = /^(\/images\/[\w./-]+|https:\/\/res\.cloudinary\.com\/[\w./%-]+)$/;

export const schemaPhoto = z.object({
  url: z
    .string()
    .trim()
    .regex(motifPhoto, "Lien attendu : /images/… ou https://res.cloudinary.com/…"),
  alt: texte("Décrivez la photo pour les lecteurs d'écran.", 200),
});

export const schemaProduit = z
  .object({
    marqueId: texte("Choisissez la marque."),
    nom: texte("Indiquez le nom du modèle."),
    slug: z
      .string()
      .trim()
      .max(120)
      .regex(/^[a-z0-9-]*$/, "Minuscules, chiffres et tirets seulement."),
    reference: texte("Indiquez la référence du fabricant.", 60),
    statut: z.enum(ProductStatus, { error: "Choisissez un statut." }),
    resume: texte("Indiquez une phrase de présentation.", 300),
    description: texte("Indiquez la description.", 5000),
    avisMaison: facultatif(2000),
    prix: montant("Indiquez un prix en euros, par exemple 1290 ou 1290,50."),
    prixBarre: montantFacultatif("Indiquez un prix barré en euros, ou laissez vide."),
    stock: entier("Indiquez un stock entier, 0 ou plus."),
    seuilStockBas: entier("Indiquez un seuil entier, 0 ou plus.", 0, 100),
    delaiExpeditionJours: entier("Indiquez un délai en jours, entre 1 et 30.", 1, 30),
    garantieMois: entier("Indiquez une garantie en mois, entre 0 et 120.", 0, 120),
    genre: z.enum(Gender, { error: "Choisissez un genre." }),
    mouvement: z.enum(Movement, { error: "Choisissez un mouvement." }),
    calibre: facultatif(80),
    reserveMarcheH: entierFacultatif(
      "Indiquez une réserve de marche en heures, ou laissez vide.",
      2000,
    ),
    diametreMm: millimetres("Indiquez un diamètre en millimètres, par exemple 40 ou 40,5."),
    epaisseurMm: millimetresFacultatifs("Indiquez une épaisseur en millimètres, ou laissez vide."),
    entreCornesMm: entierFacultatif(
      "Indiquez une largeur entre-cornes en millimètres, ou laissez vide.",
      40,
    ),
    matiereBoitier: z.enum(CaseMaterial, { error: "Choisissez la matière du boîtier." }),
    bracelet: z.enum(StrapType, { error: "Choisissez le bracelet." }),
    couleurBracelet: facultatif(40),
    couleurCadran: texte("Indiquez la couleur du cadran.", 40).transform((v) => slugifier(v)),
    etancheiteM: entier("Indiquez l'étanchéité en mètres, par exemple 100.", 0, 3000),
    verre: facultatif(60),
    fonctions: z
      .string()
      .trim()
      .max(300)
      .transform((v) =>
        v
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      ),
    titreSeo: facultatif(70),
    descriptionSeo: facultatif(160),
    collections: z.array(z.string()).default([]),
    photos: z.array(schemaPhoto).max(12, "12 photos au plus."),
  })
  .refine((p) => p.prixBarre === null || p.prixBarre > p.prix, {
    path: ["prixBarre"],
    message: "Le prix barré doit être supérieur au prix.",
  })
  .refine((p) => p.statut !== "PUBLISHED" || p.photos.length > 0, {
    path: ["photos"],
    message: "Ajoutez au moins une photo avant de publier.",
  });

export type ProduitSaisi = z.infer<typeof schemaProduit>;

/**
 * Le formulaire envoie les photos en « photos.0.url », « photos.0.alt »… et les collections
 * cochées en plusieurs « collections » : on les remet en tableaux pour le schéma.
 */
export function lireFormulaireProduit(formulaire: FormData) {
  const valeurs: Record<string, unknown> = {};
  const photos: { url: string; alt: string }[] = [];
  for (const [cle, valeur] of formulaire) {
    const photo = /^photos\.(\d+)\.(url|alt)$/.exec(cle);
    if (photo) {
      const i = Number(photo[1]);
      photos[i] ??= { url: "", alt: "" };
      photos[i][photo[2] as "url" | "alt"] = String(valeur);
    } else if (cle !== "collections") {
      valeurs[cle] = String(valeur);
    }
  }
  valeurs.collections = formulaire.getAll("collections").map(String);
  // Une ligne de photo laissée vide est ignorée, pas signalée comme erreur.
  valeurs.photos = photos.filter((p) => p && (p.url.trim() || p.alt.trim()));
  return valeurs;
}

/** État renvoyé par une action de formulaire du back-office (useActionState). */
export type EtatFormulaireAdmin = {
  message: string;
  erreurs?: Record<string, string | undefined>;
  /** Saisie renvoyée telle quelle pour regarnir le formulaire ; les cases cochées jointes par des virgules. */
  valeurs?: Record<string, string>;
} | null;

/** Saisie brute d'un formulaire, à renvoyer avec les erreurs. */
export function saisieBrute(formulaire: FormData) {
  const valeurs: Record<string, string> = {};
  for (const cle of new Set(formulaire.keys())) {
    valeurs[cle] = formulaire.getAll(cle).map(String).join(",");
  }
  return valeurs;
}

/** Erreurs Zod → un message par champ ; une photo garde son rang (« photos.1.alt »). */
export function erreursParChamp(erreur: z.ZodError) {
  const erreurs: Record<string, string> = {};
  for (const probleme of erreur.issues) {
    const [champ, index, sousChamp] = probleme.path.map(String);
    const cle =
      champ === "photos" && sousChamp !== undefined ? `photos.${index}.${sousChamp}` : champ;
    erreurs[cle] ??= probleme.message;
  }
  return erreurs;
}

const ordre = z.coerce
  .number({ error: "Indiquez un nombre entier." })
  .int("Indiquez un nombre entier.")
  .min(0, "Indiquez un nombre positif.")
  .max(999, "999 au plus.");
const adresse = z
  .string()
  .trim()
  .max(120)
  .regex(/^[a-z0-9-]*$/, "Minuscules, chiffres et tirets seulement.");

export const schemaMarque = z.object({
  nom: texte("Indiquez le nom de la marque.", 60),
  slug: adresse,
  description: facultatif(600),
  histoire: facultatif(5000),
  pays: facultatif(60),
  anneeCreation: entierFacultatif("Indiquez une année, par exemple 1853, ou laissez vide.", 2100),
  ordre,
});

export const schemaCollection = z.object({
  nom: texte("Indiquez le nom de la collection.", 80),
  slug: adresse,
  description: facultatif(600),
  ordre,
});

/** Étape suivante d'une commande payée, dans l'ordre de l'atelier. */
export const etapeSuivante: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: "PREPARING",
  PREPARING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

/**
 * Une commande se rembourse dès qu'un paiement existe : payée, en cours, livrée (retour sous
 * 14 jours) ou annulée pour rupture quand le remboursement automatique a échoué.
 */
export function estRemboursable(statut: OrderStatus, paymentIntentId: string | null) {
  return Boolean(paymentIntentId) && statut !== "PENDING" && statut !== "REFUNDED";
}

export const schemaExpedition = z.object({
  transporteur: texte("Indiquez le transporteur.", 60),
  numeroSuivi: texte("Indiquez le numéro de suivi.", 60),
  lienSuivi: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https:\/\/\S+$/.test(v), "Lien attendu : https://…")
    .transform((v) => v || null),
});
