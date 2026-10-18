"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { exigerAdmin } from "@/lib/admin/serveur";
import {
  erreursParChamp,
  lireFormulaireProduit,
  schemaProduit,
  saisieBrute,
  slugifier,
  type EtatFormulaireAdmin,
} from "@/lib/admin/regles";
import { db } from "@/lib/db";

/** Création (sans « id ») ou modification d'un produit, puis retour à la liste. */
export async function enregistrerProduit(
  _etat: EtatFormulaireAdmin,
  formulaire: FormData,
): Promise<EtatFormulaireAdmin> {
  await exigerAdmin("/admin/produits");
  const id = String(formulaire.get("id") ?? "") || null;
  const saisie = schemaProduit.safeParse(lireFormulaireProduit(formulaire));
  if (!saisie.success) {
    return {
      message: "Certains champs sont à corriger.",
      erreurs: erreursParChamp(saisie.error),
      valeurs: saisieBrute(formulaire),
    };
  }
  const p = saisie.data;
  const marque = await db.brand.findUnique({ where: { id: p.marqueId }, select: { name: true } });
  if (!marque)
    return { message: "Marque introuvable.", erreurs: { marqueId: "Marque introuvable." } };
  const slug = p.slug || slugifier(`${marque.name} ${p.nom} ${p.couleurCadran}`);

  const donnees = {
    slug,
    name: p.nom,
    reference: p.reference,
    brandId: p.marqueId,
    status: p.statut,
    shortDescription: p.resume,
    description: p.description,
    editorialNote: p.avisMaison,
    priceCents: p.prix,
    compareAtCents: p.prixBarre,
    stock: p.stock,
    lowStockThreshold: p.seuilStockBas,
    leadTimeDays: p.delaiExpeditionJours,
    warrantyMonths: p.garantieMois,
    gender: p.genre,
    movement: p.mouvement,
    caliber: p.calibre,
    powerReserveH: p.reserveMarcheH,
    caseDiameterMm: p.diametreMm,
    caseThicknessMm: p.epaisseurMm,
    lugWidthMm: p.entreCornesMm,
    caseMaterial: p.matiereBoitier,
    strapType: p.bracelet,
    strapColor: p.couleurBracelet,
    dialColor: p.couleurCadran,
    waterResistanceM: p.etancheiteM,
    crystal: p.verre,
    functions: p.fonctions,
    metaTitle: p.titreSeo,
    metaDescription: p.descriptionSeo,
  };
  // Les dimensions ne servent pas à l'affichage (les photos remplissent leur cadre) : 0 = inconnues.
  const photos = p.photos.map((photo, position) => ({
    publicId: photo.url,
    url: photo.url,
    alt: photo.alt,
    width: 0,
    height: 0,
    position,
  }));
  const collections = p.collections.map((collectionId, position) => ({ collectionId, position }));

  let ancienSlug: string | null = null;
  try {
    if (id) {
      const avant = await db.product.findUnique({ where: { id }, select: { slug: true } });
      if (!avant) return { message: "Produit introuvable." };
      ancienSlug = avant.slug;
      await db.$transaction([
        db.productImage.deleteMany({ where: { productId: id } }),
        db.productCollection.deleteMany({ where: { productId: id } }),
        db.product.update({
          where: { id },
          data: {
            ...donnees,
            images: { create: photos },
            collections: { create: collections },
          },
        }),
      ]);
    } else {
      await db.product.create({
        data: { ...donnees, images: { create: photos }, collections: { create: collections } },
      });
    }
  } catch (erreur) {
    if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
      const champ = String(erreur.meta?.target ?? "").includes("reference") ? "reference" : "slug";
      return {
        message: "Certains champs sont à corriger.",
        valeurs: saisieBrute(formulaire),
        erreurs: {
          [champ]:
            champ === "slug"
              ? "Cette adresse est déjà prise par un autre produit."
              : "Cette référence existe déjà.",
        },
      };
    }
    throw erreur;
  }

  updateTag("catalogue");
  updateTag(`produit:${slug}`);
  if (ancienSlug && ancienSlug !== slug) updateTag(`produit:${ancienSlug}`);
  redirect("/admin/produits?enregistre=1");
}
