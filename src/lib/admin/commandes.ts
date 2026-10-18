// Lectures des commandes pour le back-office.
import "server-only";
import type { OrderStatus } from "@/generated/prisma/enums";
import { chargerCommande } from "@/lib/commandes/donnees";
import { db } from "@/lib/db";

/** Sans filtre, les paniers partis sur Stripe sans payer (« en attente ») sont masqués. */
export function listeCommandesAdmin({
  statut,
  recherche,
}: {
  statut?: OrderStatus;
  recherche?: string;
}) {
  return db.order.findMany({
    where: {
      status: statut ?? { not: "PENDING" },
      ...(recherche && {
        OR: [
          { number: { contains: recherche, mode: "insensitive" } },
          { email: { contains: recherche, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      number: true,
      email: true,
      status: true,
      totalCents: true,
      createdAt: true,
      paidAt: true,
      _count: { select: { items: true } },
    },
  });
}

export async function commandePourAdmin(numero: string) {
  const commande = await chargerCommande({ number: numero });
  if (!commande) return null;
  const evenements = await db.orderEvent.findMany({
    where: { orderId: commande.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, status: true, note: true, createdAt: true, actorId: true },
  });
  const auteurs = await db.user.findMany({
    where: { id: { in: evenements.flatMap((e) => (e.actorId ? [e.actorId] : [])) } },
    select: { id: true, name: true, email: true },
  });
  const nomAuteur = (id: string | null) => {
    const auteur = auteurs.find((a) => a.id === id);
    return auteur ? (auteur.name ?? auteur.email) : null;
  };
  return {
    ...commande,
    evenements: evenements.map((e) => ({ ...e, auteur: nomAuteur(e.actorId) })),
  };
}
