import { Button, Text } from "@react-email/components";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { GabaritEmail, styles } from "./gabarit";

export function EmailCommandeExpediee({ commande }: { commande: CommandeComplete }) {
  const montres = commande.items.map((i) => `${i.brandName} ${i.productName}`).join(", ");
  return (
    <GabaritEmail apercu={`Votre commande ${commande.number} est en route.`}>
      <Text style={styles.titre}>Votre montre est en route</Text>
      <Text style={styles.texte}>
        Votre commande {commande.number} ({montres}) vient de quitter l&apos;atelier
        {commande.carrier ? ` avec ${commande.carrier}` : ""}. Elle vous sera remise contre
        signature.
      </Text>
      {commande.trackingNumber && (
        <Text style={styles.texte}>Numéro de suivi : {commande.trackingNumber}</Text>
      )}
      {commande.trackingUrl && (
        <Button href={commande.trackingUrl} style={styles.bouton}>
          Suivre le colis
        </Button>
      )}
    </GabaritEmail>
  );
}
