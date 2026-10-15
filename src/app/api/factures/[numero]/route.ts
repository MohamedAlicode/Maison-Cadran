// Téléchargement d'une facture PDF. Sans compte client (phase 4), l'accès se prouve avec
// l'identifiant de la session Stripe de la commande, connu seulement de l'acheteur.
import type { NextRequest } from "next/server";
import { chargerCommande } from "@/lib/commandes/donnees";
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
  if (!commande || !sessionId || commande.stripeCheckoutSessionId !== sessionId) {
    return new Response("Facture introuvable", { status: 404 });
  }

  const pdf = await genererFacturePdf(commande);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="facture-${numero}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
