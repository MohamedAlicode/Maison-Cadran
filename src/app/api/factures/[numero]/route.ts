// Téléchargement d'une facture PDF. L'accès se prouve avec l'identifiant de la session Stripe
// de la commande, connu seulement de l'acheteur, en étant le client connecté de la commande,
// ou en étant admin.
import type { NextRequest } from "next/server";
import { chargerCommande } from "@/lib/commandes/donnees";
import { adminConnecte } from "@/lib/admin/serveur";
import { clientConnecte } from "@/lib/compte/serveur";
import { db } from "@/lib/db";
import { genererFacturePdf } from "@/lib/facture/document";

export async function GET(
  requete: NextRequest,
  { params }: RouteContext<"/api/factures/[numero]">,
) {
  const { numero } = await params;
  const sessionId = requete.nextUrl.searchParams.get("session_id");

  const facture = await db.invoice.findUnique({
    where: { number: numero },
    select: { orderId: true },
  });
  const commande = facture && (await chargerCommande({ id: facture.orderId }));
  const autorise =
    commande &&
    ((sessionId && commande.stripeCheckoutSessionId === sessionId) ||
      (commande.userId && commande.userId === (await clientConnecte())?.id) ||
      (await adminConnecte()));
  if (!commande || !autorise) return new Response("Facture introuvable", { status: 404 });

  const pdf = await genererFacturePdf(commande);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="facture-${numero}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
