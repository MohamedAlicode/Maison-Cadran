import { Text } from "@react-email/components";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { formatPrix } from "@/lib/prix";
import { GabaritEmail, styles } from "./gabarit";

/** Cas rare : la dernière pièce a été payée par deux clients en même temps. */
export function EmailCommandeRemboursee({ commande }: { commande: CommandeComplete }) {
  const montres = commande.items.map((i) => `${i.brandName} ${i.productName}`).join(", ");
  return (
    <GabaritEmail
      apercu={`Votre commande ${commande.number} n'a pas pu être honorée.`}
      rappels={false}
    >
      <Text style={styles.titre}>Toutes nos excuses</Text>
      <Text style={styles.texte}>
        La dernière pièce de votre sélection ({montres}) a été réservée par un autre client au
        moment même de votre paiement. Nous ne pouvons donc pas honorer votre commande{" "}
        {commande.number}.
      </Text>
      <Text style={styles.texte}>
        {commande.status === "REFUNDED"
          ? `Vous êtes intégralement remboursé de ${formatPrix(commande.totalCents)}. Le montant apparaîtra sur votre compte sous 5 à 10 jours, selon votre banque.`
          : `Votre remboursement de ${formatPrix(commande.totalCents)} est en cours : nous vous écrirons dès qu'il sera effectué.`}
      </Text>
      <Text style={styles.texte}>
        Si vous le souhaitez, répondez à cet e-mail : nous vous aiderons à trouver une montre
        proche.
      </Text>
    </GabaritEmail>
  );
}
