// Garde du back-office : chaque page et chaque action admin repasse par exigerAdmin.
// Le rôle est relu en base à chaque requête : retirer le rôle coupe l'accès aussitôt.
import "server-only";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { clientConnecte, type Client } from "@/lib/compte/serveur";
import { cheminRetour } from "@/lib/compte/regles";
import { db } from "@/lib/db";

export const adminConnecte = cache(async (): Promise<Client | null> => {
  const client = await clientConnecte();
  if (!client) return null;
  const utilisateur = await db.user.findUnique({
    where: { id: client.id },
    select: { role: true },
  });
  return utilisateur?.role === "ADMIN" ? client : null;
});

/** Sans session : vers la connexion. Avec une session sans rôle admin : 404, la page n'existe pas. */
export async function exigerAdmin(retour = "/admin"): Promise<Client> {
  const client = await clientConnecte();
  if (!client) redirect(`/connexion?retour=${encodeURIComponent(cheminRetour(retour))}`);
  const admin = await adminConnecte();
  if (!admin) notFound();
  return admin;
}
