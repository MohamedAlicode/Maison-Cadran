"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { exigerAdmin } from "@/lib/admin/serveur";
import {
  erreursParChamp,
  saisieBrute,
  schemaCollection,
  schemaMarque,
  slugifier,
  type EtatFormulaireAdmin,
} from "@/lib/admin/regles";
import { db } from "@/lib/db";

function adressePrise(erreur: unknown, formulaire: FormData): EtatFormulaireAdmin | undefined {
  if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
    const champ = String(erreur.meta?.target ?? "").includes("name") ? "nom" : "slug";
    return {
      message: "Certains champs sont à corriger.",
      erreurs: {
        [champ]: champ === "nom" ? "Ce nom existe déjà." : "Cette adresse est déjà prise.",
      },
      valeurs: saisieBrute(formulaire),
    };
  }
}

export async function enregistrerMarque(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  await exigerAdmin("/admin/marques");
  const id = String(formulaire.get("id") ?? "") || null;
  const saisie = schemaMarque.safeParse(Object.fromEntries(formulaire));
  if (!saisie.success) {
    return {
      message: "Certains champs sont à corriger.",
      erreurs: erreursParChamp(saisie.error),
      valeurs: saisieBrute(formulaire),
    };
  }
  const m = saisie.data;
  const donnees = {
    name: m.nom,
    slug: m.slug || slugifier(m.nom),
    description: m.description,
    history: m.histoire,
    country: m.pays,
    foundedYear: m.anneeCreation,
    sortOrder: m.ordre,
  };
  try {
    if (id) await db.brand.update({ where: { id }, data: donnees });
    else await db.brand.create({ data: donnees });
  } catch (erreur) {
    const etat = adressePrise(erreur, formulaire);
    if (etat) return etat;
    throw erreur;
  }
  updateTag("catalogue");
  redirect("/admin/marques?enregistre=1");
}

/** Une marque qui a encore des montres ne se supprime pas : on archive d'abord ses montres. */
export async function supprimerMarque(id: string) {
  await exigerAdmin("/admin/marques");
  const montres = await db.product.count({ where: { brandId: id } });
  if (montres > 0) return { ok: false, message: `Cette marque a encore ${montres} montre(s).` };
  await db.brand.delete({ where: { id } });
  updateTag("catalogue");
  redirect("/admin/marques");
}

export async function enregistrerCollection(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  await exigerAdmin("/admin/collections");
  const id = String(formulaire.get("id") ?? "") || null;
  const saisie = schemaCollection.safeParse(Object.fromEntries(formulaire));
  if (!saisie.success) {
    return {
      message: "Certains champs sont à corriger.",
      erreurs: erreursParChamp(saisie.error),
      valeurs: saisieBrute(formulaire),
    };
  }
  const c = saisie.data;
  const donnees = {
    name: c.nom,
    slug: c.slug || slugifier(c.nom),
    description: c.description,
    sortOrder: c.ordre,
  };
  try {
    if (id) await db.collection.update({ where: { id }, data: donnees });
    else await db.collection.create({ data: donnees });
  } catch (erreur) {
    const etat = adressePrise(erreur, formulaire);
    if (etat) return etat;
    throw erreur;
  }
  updateTag("catalogue");
  redirect("/admin/collections?enregistre=1");
}

/** Supprimer une collection retire seulement le classement : les montres restent en ligne. */
export async function supprimerCollection(id: string) {
  await exigerAdmin("/admin/collections");
  await db.collection.delete({ where: { id } });
  updateTag("catalogue");
  redirect("/admin/collections");
}
