// Chiffres du tableau de bord, tous lus en base : rien n'est estimé.
import "server-only";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/enums";

/** Commandes réellement encaissées : une commande remboursée sort du chiffre d'affaires. */
export const STATUTS_ENCAISSES: OrderStatus[] = ["PAID", "PREPARING", "SHIPPED", "DELIVERED"];

const JOUR_MS = 24 * 60 * 60 * 1000;

export async function chiffresTableauDeBord(maintenant = new Date()) {
  const depuis = new Date(maintenant.getTime() - 30 * JOUR_MS);
  const encaissees = { status: { in: STATUTS_ENCAISSES } };

  const [mois, aPreparer, aExpedier, ventes, produits, avisRecents, dernieres] = await Promise.all([
    db.order.aggregate({
      where: { ...encaissees, paidAt: { gte: depuis } },
      _sum: { totalCents: true },
      _count: true,
    }),
    db.order.count({ where: { status: "PAID" } }),
    db.order.count({ where: { status: "PREPARING" } }),
    db.orderItem.groupBy({
      by: ["productName", "brandName"],
      where: { order: encaissees },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.product.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        name: true,
        stock: true,
        lowStockThreshold: true,
        brand: { select: { name: true } },
      },
      orderBy: { stock: "asc" },
    }),
    db.review.count({
      where: { createdAt: { gte: new Date(maintenant.getTime() - 7 * JOUR_MS) } },
    }),
    db.order.findMany({
      // Les paiements abandonnés ne sont pas des commandes à suivre.
      where: {
        status: { not: "PENDING" },
        NOT: { status: "CANCELLED", stripePaymentIntentId: null },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { number: true, status: true, email: true, totalCents: true, createdAt: true },
    }),
  ]);

  const chiffreAffaires = mois._sum.totalCents ?? 0;
  return {
    chiffreAffaires,
    commandes: mois._count,
    panierMoyen: mois._count ? Math.round(chiffreAffaires / mois._count) : 0,
    aPreparer,
    aExpedier,
    avisRecents,
    meilleuresVentes: ventes.map((v) => ({
      nom: `${v.brandName} ${v.productName}`,
      quantite: v._sum.quantity ?? 0,
    })),
    stocksBas: produits.filter((p) => p.stock <= p.lowStockThreshold),
    dernieresCommandes: dernieres,
  };
}
