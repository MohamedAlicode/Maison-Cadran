import { Text } from "@react-email/components";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { formatPrix } from "@/lib/prix";
import { GabaritEmail, styles } from "./gabarit";

/** Remboursement décidé par la boutique (retour, annulation), pas la rupture au paiement. */
export function EmailRemboursement({ commande }: { commande: CommandeComplete }) {
  return (
    <GabaritEmail apercu={`Remboursement de votre commande ${commande.number}.`} rappels={false}>
      <Text style={styles.titre}>Votre remboursement est effectué</Text>
      <Text style={styles.texte}>
        Nous avons remboursé {formatPrix(commande.totalCents)} pour votre commande {commande.number}
        . Le montant apparaîtra sur votre compte sous 5 à 10 jours, selon votre banque.
      </Text>
      <Text style={styles.texte}>Une question ? Répondez simplement à cet e-mail.</Text>
    </GabaritEmail>
  );
}
