// Accès aux données du client connecté : chaque lecture repart de la session, jamais d'un
// identifiant envoyé par le navigateur.
import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cheminRetour } from "./regles";

export type Client = { id: string; email: string; nom: string | null };

/** Lit le cookie de session : à appeler sous un <Suspense>, jamais en tête d'un layout. */
export const clientConnecte = cache(async (): Promise<Client | null> => {
  // Auth.js tire des valeurs aléatoires : sans cet appel, Next tenterait de les précalculer.
  await connection();
  const utilisateur = (await auth())?.user;
  if (!utilisateur?.id || !utilisateur.email) return null;
  return { id: utilisateur.id, email: utilisateur.email, nom: utilisateur.name ?? null };
});

export async function exigerClient(retour: string): Promise<Client> {
  const client = await clientConnecte();
  if (!client) redirect(`/connexion?retour=${encodeURIComponent(cheminRetour(retour))}`);
  return client;
}

export async function idsFavoris(clientId: string) {
  const favoris = await db.wishlistItem.findMany({
    where: { userId: clientId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return favoris.map((f) => f.productId);
}

/** Commandes payées du client : les paiements abandonnés ou refusés n'y figurent pas. */
export async function commandesClient(clientId: string, limite?: number) {
  return db.order.findMany({
    where: {
      userId: clientId,
      status: { not: "PENDING" },
      NOT: { status: "CANCELLED", stripePaymentIntentId: null },
    },
    orderBy: { createdAt: "desc" },
    take: limite,
    select: {
      number: true,
      status: true,
      createdAt: true,
      paidAt: true,
      totalCents: true,
      items: { select: { id: true, brandName: true, productName: true, imageUrl: true } },
    },
  });
}

export type ResumeCommande = Awaited<ReturnType<typeof commandesClient>>[number];
