import { Button, Column, Hr, Row, Section, Text } from "@react-email/components";
import { boutique } from "@/config/boutique";
import { couleursImprimees as c } from "@/config/couleurs-imprimees";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { formatDate } from "@/lib/facture/lignes";
import { formatPrix } from "@/lib/prix";
import { GabaritEmail, policeTitre, styles } from "./gabarit";

/** Confirmation envoyée quand Stripe confirme le paiement, facture PDF en pièce jointe. */
export function EmailCommandeConfirmee({
  commande,
  urlCommande,
}: {
  commande: CommandeComplete;
  urlCommande: string;
}) {
  const prenom = commande.adresseFacturation?.nom.split(" ")[0];
  const livraison = commande.adresseLivraison;

  return (
    <GabaritEmail apercu={`Votre commande ${commande.number} est confirmée.`}>
      <Text style={styles.titre}>Merci pour votre commande</Text>
      <Text style={styles.texte}>
        {prenom ? `Bonjour ${prenom}, votre` : "Votre"} paiement est confirmé. Nous préparons votre
        montre avec soin et vous écrirons dès son expédition, avec le numéro de suivi.
      </Text>
      <Text style={styles.discret}>
        Commande {commande.number}
        {commande.paidAt && ` · ${formatDate(commande.paidAt)}`}
      </Text>

      <Hr style={styles.filet} />

      {commande.items.map((item) => (
        <Row key={item.id} style={{ marginBottom: "12px" }}>
          <Column>
            <Text style={{ fontFamily: policeTitre, fontSize: "20px", margin: 0, color: c.encre }}>
              <span style={{ color: c.graphite }}>{item.brandName}</span> {item.productName}
            </Text>
            <Text style={styles.discret}>
              Réf. {item.reference}
              {item.quantity > 1 && ` · ${item.quantity} exemplaires`}
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: "top", width: "120px" }}>
            <Text style={{ ...styles.texte, margin: 0 }}>
              {formatPrix(item.unitPriceCents * item.quantity)}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={styles.filet} />

      <Section>
        <Row>
          <Column>
            <Text style={styles.discret}>Sous-total</Text>
          </Column>
          <Column align="right">
            <Text style={styles.discret}>{formatPrix(commande.subtotalCents)}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={styles.discret}>Livraison</Text>
          </Column>
          <Column align="right">
            <Text style={styles.discret}>
              {commande.shippingCents === 0 ? "Offerte" : formatPrix(commande.shippingCents)}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={{ ...styles.texte, fontWeight: 500, margin: "8px 0 0" }}>Total TTC</Text>
          </Column>
          <Column align="right">
            <Text style={{ ...styles.texte, fontWeight: 500, margin: "8px 0 0" }}>
              {formatPrix(commande.totalCents)}
            </Text>
          </Column>
        </Row>
        <Text style={styles.discret}>Dont TVA {formatPrix(commande.vatCents)}</Text>
      </Section>

      {livraison && (
        <>
          <Hr style={styles.filet} />
          <Text style={styles.libelle}>Livraison</Text>
          <Text style={{ ...styles.texte, margin: 0 }}>
            {livraison.nom}
            <br />
            {livraison.ligne1}
            {livraison.ligne2 && (
              <>
                <br />
                {livraison.ligne2}
              </>
            )}
            <br />
            {livraison.codePostal} {livraison.ville}
          </Text>
          <Text style={{ ...styles.discret, marginTop: "8px" }}>
            {boutique.livraison.transporteur}, assurée.
          </Text>
        </>
      )}

      <Hr style={styles.filet} />
      {commande.invoice && (
        <Text style={styles.texte}>
          Votre facture {commande.invoice.number} est jointe à cet e-mail.
        </Text>
      )}
      <Button href={urlCommande} style={styles.bouton}>
        Voir ma commande
      </Button>
    </GabaritEmail>
  );
}
