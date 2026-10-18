"use server";

import { refresh, updateTag } from "next/cache";
import { exigerAdmin } from "@/lib/admin/serveur";
import { db } from "@/lib/db";

/** Masquer (REJECTED) ou republier (APPROVED) un avis déjà publié. */
export async function changerStatutAvis(id: string, statut: "APPROVED" | "REJECTED") {
  await exigerAdmin("/admin/avis");
  const avis = await db.review.update({
    where: { id },
    data: { status: statut },
    select: { product: { select: { slug: true } } },
  });
  // La note moyenne compte aussi pour « Les plus appréciées » de l'accueil.
  updateTag("catalogue");
  updateTag(`produit:${avis.product.slug}`);
  refresh();
}
