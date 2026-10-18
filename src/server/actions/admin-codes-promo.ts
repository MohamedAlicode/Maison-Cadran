"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import {
  erreursParChamp,
  saisieBrute,
  schemaCodePromo,
  type EtatFormulaireAdmin,
} from "@/lib/admin/regles";
import { exigerAdmin } from "@/lib/admin/serveur";
import { db } from "@/lib/db";

export async function enregistrerCodePromo(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  await exigerAdmin("/admin/codes-promo");
  const id = String(formulaire.get("id") ?? "") || null;
  const saisie = schemaCodePromo.safeParse(Object.fromEntries(formulaire));
  if (!saisie.success) {
    return {
      message: "Certains champs sont à corriger.",
      erreurs: erreursParChamp(saisie.error),
      valeurs: saisieBrute(formulaire),
    };
  }
  try {
    if (id) await db.discountCode.update({ where: { id }, data: saisie.data });
    else await db.discountCode.create({ data: saisie.data });
  } catch (erreur) {
    if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
      return {
        message: "Certains champs sont à corriger.",
        erreurs: { code: "Ce code existe déjà." },
        valeurs: saisieBrute(formulaire),
      };
    }
    throw erreur;
  }
  updateTag("codes-promo");
  redirect("/admin/codes-promo?enregistre=1");
}

/** Un code déjà utilisé reste dans l'historique des commandes : on le désactive plutôt. */
export async function supprimerCodePromo(id: string) {
  await exigerAdmin("/admin/codes-promo");
  const code = await db.discountCode.findUnique({ where: { id }, select: { usesCount: true } });
  if (code && code.usesCount > 0) {
    return {
      ok: false,
      message: "Ce code a déjà servi : décochez « Actif » pour l'arrêter.",
    };
  }
  await db.discountCode.delete({ where: { id } });
  updateTag("codes-promo");
  redirect("/admin/codes-promo");
}
