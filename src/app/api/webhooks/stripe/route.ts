// Webhook Stripe : seule porte d'entrée qui confirme un paiement.
// La signature est vérifiée sur le corps brut, avant toute lecture du contenu.
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import Stripe from "stripe";
import { envoyerEmailsCommande } from "@/lib/commandes/emails";
import { traiterEvenementStripe } from "@/lib/commandes/paiement";
import { env } from "@/lib/env";

export async function POST(requete: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook non configuré", { status: 503 });
  }

  const signature = requete.headers.get("stripe-signature");
  if (!signature) return new Response("Signature manquante", { status: 400 });

  let evenement: Stripe.Event;
  try {
    evenement = Stripe.webhooks.constructEvent(
      await requete.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  const issue = await traiterEvenementStripe(evenement);

  if (issue.type === "payee" || issue.type === "rupture") {
    // Le stock a changé : les fiches et le catalogue se mettront à jour à la prochaine visite.
    if (issue.type === "payee") revalidateTag("catalogue", "max");
    // Les e-mails partent après la réponse : Stripe n'attend pas, et un échec d'envoi
    // ne doit pas lui faire renvoyer un paiement déjà enregistré.
    after(() => envoyerEmailsCommande(issue.commandeId));
  }

  return Response.json({ recu: true });
}
