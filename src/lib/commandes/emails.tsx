// E-mails envoyés après un événement de paiement : confirmation avec facture, ou excuses.
import "server-only";
import { EmailCommandeConfirmee } from "@/emails/commande-confirmee";
import { EmailCommandeRemboursee } from "@/emails/commande-remboursee";
import { envoyerEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { genererFacturePdf } from "@/lib/facture/document";
import { chargerCommande } from "./donnees";

export async function envoyerEmailsCommande(commandeId: string) {
  try {
    const commande = await chargerCommande({ id: commandeId });
    if (!commande?.email) return;

    if (commande.status === "PAID" && commande.invoice) {
      const pdf = await genererFacturePdf(commande);
      await envoyerEmail({
        a: commande.email,
        sujet: `Votre commande ${commande.number} est confirmée`,
        contenu: (
          <EmailCommandeConfirmee
            commande={commande}
            urlCommande={`${env.NEXT_PUBLIC_SITE_URL}/commande/confirmation?session_id=${commande.stripeCheckoutSessionId}`}
          />
        ),
        piecesJointes: [{ nom: `facture-${commande.invoice.number}.pdf`, contenu: pdf }],
      });
    } else if (commande.status === "REFUNDED" || commande.status === "CANCELLED") {
      await envoyerEmail({
        a: commande.email,
        sujet: `Votre commande ${commande.number} n'a pas pu être honorée`,
        contenu: <EmailCommandeRemboursee commande={commande} />,
      });
    }
  } catch (erreur) {
    // Un e-mail perdu ne doit pas faire échouer le traitement du paiement, déjà enregistré.
    console.error(`E-mail de la commande ${commandeId} non envoyé`, erreur);
  }
}
