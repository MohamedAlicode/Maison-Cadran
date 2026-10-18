"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import {
  erreursParChamp,
  saisieBrute,
  schemaArticle,
  slugifier,
  type EtatFormulaireAdmin,
} from "@/lib/admin/regles";
import { exigerAdmin } from "@/lib/admin/serveur";
import { db } from "@/lib/db";

export async function enregistrerArticle(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  await exigerAdmin("/admin/articles");
  const id = String(formulaire.get("id") ?? "") || null;
  const saisie = schemaArticle.safeParse(Object.fromEntries(formulaire));
  if (!saisie.success) {
    return {
      message: "Certains champs sont à corriger.",
      erreurs: erreursParChamp(saisie.error),
      valeurs: saisieBrute(formulaire),
    };
  }
  const a = saisie.data;
  // La date de publication est gardée d'un enregistrement à l'autre : elle classe le guide.
  const avant = id
    ? await db.article.findUnique({ where: { id }, select: { publishedAt: true } })
    : null;
  const donnees = {
    title: a.titre,
    slug: a.slug || slugifier(a.titre),
    excerpt: a.resume,
    content: a.contenu,
    coverUrl: a.couverture,
    coverAlt: a.couverture ? a.descriptionCouverture : null,
    publishedAt: a.publie === "on" ? (avant?.publishedAt ?? new Date()) : null,
    metaTitle: a.titreSeo,
    metaDescription: a.descriptionSeo,
  };
  try {
    if (id) await db.article.update({ where: { id }, data: donnees });
    else await db.article.create({ data: donnees });
  } catch (erreur) {
    if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
      return {
        message: "Certains champs sont à corriger.",
        erreurs: { slug: "Cette adresse est déjà prise par un autre article." },
        valeurs: saisieBrute(formulaire),
      };
    }
    throw erreur;
  }
  updateTag("articles");
  redirect("/admin/articles?enregistre=1");
}

export async function supprimerArticle(id: string) {
  await exigerAdmin("/admin/articles");
  await db.article.delete({ where: { id } });
  updateTag("articles");
  redirect("/admin/articles");
}
