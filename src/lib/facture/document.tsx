// Facture PDF, générée à la demande depuis l'instantané immuable de la commande :
// la régénérer donne toujours le même document, il n'y a donc rien à stocker.
import "server-only";
import path from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { boutique } from "@/config/boutique";
import { couleursImprimees as c } from "@/config/couleurs-imprimees";
import type { Adresse } from "@/lib/commandes/adresse";
import type { CommandeComplete } from "@/lib/commandes/donnees";
import { formatPrix } from "@/lib/prix";
import { formatDate, lignesFacture } from "./lignes";

const polices = path.join(process.cwd(), "src/lib/facture/polices");
Font.register({
  family: "Instrument Serif",
  src: path.join(polices, "InstrumentSerif-Regular.ttf"),
});
Font.register({
  family: "Hanken Grotesk",
  fonts: [
    { src: path.join(polices, "HankenGrotesk-Regular.ttf"), fontWeight: 400 },
    { src: path.join(polices, "HankenGrotesk-Medium.ttf"), fontWeight: 500 },
  ],
});
// Pas de césure automatique : une référence de montre ne se coupe pas.
Font.registerHyphenationCallback((mot) => [mot]);

const s = StyleSheet.create({
  page: {
    fontFamily: "Hanken Grotesk",
    fontSize: 9,
    color: c.encre,
    padding: 48,
    lineHeight: 1.45,
  },
  entete: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  // Hauteurs de ligne explicites pour le logo et le titre : celle de la page (1,45) est
  // calculée sur le corps 9 et les laisserait déborder sur la ligne du dessous.
  logo: { fontFamily: "Instrument Serif", fontSize: 22, lineHeight: 1.2, letterSpacing: 1.5 },
  titre: { fontFamily: "Instrument Serif", fontSize: 26, lineHeight: 1.2, textAlign: "right" },
  discret: { color: c.graphite },
  libelle: {
    fontSize: 7.5,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: c.graphite,
    marginBottom: 4,
  },
  blocs: { flexDirection: "row", gap: 24, marginBottom: 28 },
  bloc: { flex: 1 },
  tableau: { borderTopWidth: 1, borderTopColor: c.encre },
  ligne: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: c.filet,
  },
  enTeteTableau: { fontWeight: 500, color: c.graphite, fontSize: 7.5, textTransform: "uppercase" },
  colDesignation: { flex: 1, paddingRight: 8 },
  colQte: { width: 32, textAlign: "right" },
  colMontant: { width: 72, textAlign: "right" },
  colTaux: { width: 40, textAlign: "right" },
  totaux: { marginTop: 16, marginLeft: "auto", width: 220 },
  total: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: c.encre,
    marginTop: 4,
    paddingTop: 6,
    fontWeight: 500,
    fontSize: 11,
  },
  pied: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 7.5,
    color: c.graphite,
    textAlign: "center",
  },
});

function BlocAdresse({ titre, adresse }: { titre: string; adresse: Adresse | null }) {
  return (
    <View style={s.bloc}>
      <Text style={s.libelle}>{titre}</Text>
      {adresse ? (
        <>
          <Text>{adresse.nom}</Text>
          <Text>{adresse.ligne1}</Text>
          {adresse.ligne2 && <Text>{adresse.ligne2}</Text>}
          <Text>
            {adresse.codePostal} {adresse.ville}
          </Text>
          <Text>{adresse.pays === "FR" ? "France" : adresse.pays}</Text>
        </>
      ) : (
        <Text style={s.discret}>Non renseignée</Text>
      )}
    </View>
  );
}

type Facture = NonNullable<CommandeComplete["invoice"]>;

function DocumentFacture({ commande, facture }: { commande: CommandeComplete; facture: Facture }) {
  const { lignes, totalHtCentimes, totalTvaCentimes, totalTtcCentimes } = lignesFacture(commande);
  const societe = boutique.societe;

  return (
    <Document title={`Facture ${facture.number}`} author={boutique.nom} language="fr">
      <Page size="A4" style={s.page}>
        <View style={s.entete}>
          <View>
            <Text style={s.logo}>MAISON CADRAN</Text>
            <Text style={[s.discret, { marginTop: 6 }]}>{societe.raisonSociale}</Text>
            <Text style={s.discret}>{societe.siege}</Text>
            <Text style={s.discret}>SIRET {societe.siret}</Text>
            <Text style={s.discret}>TVA intracommunautaire {societe.tvaIntracom}</Text>
            <Text style={s.discret}>{boutique.contact.email}</Text>
          </View>
          <View>
            <Text style={s.titre}>Facture</Text>
            <Text style={{ textAlign: "right", marginTop: 6 }}>N° {facture.number}</Text>
            <Text style={[s.discret, { textAlign: "right" }]}>
              Émise le {formatDate(facture.issuedAt)}
            </Text>
            <Text style={[s.discret, { textAlign: "right" }]}>Commande {commande.number}</Text>
          </View>
        </View>

        <View style={s.blocs}>
          <BlocAdresse titre="Facturé à" adresse={commande.adresseFacturation} />
          <BlocAdresse titre="Livré à" adresse={commande.adresseLivraison} />
        </View>

        <View style={s.tableau}>
          <View style={[s.ligne, s.enTeteTableau]}>
            <Text style={s.colDesignation}>Désignation</Text>
            <Text style={s.colQte}>Qté</Text>
            <Text style={s.colMontant}>PU HT</Text>
            <Text style={s.colTaux}>TVA</Text>
            <Text style={s.colMontant}>Total TTC</Text>
          </View>
          {lignes.map((ligne, i) => (
            <View key={i} style={s.ligne} wrap={false}>
              <View style={s.colDesignation}>
                <Text>{ligne.designation}</Text>
                {ligne.reference && <Text style={s.discret}>Réf. {ligne.reference}</Text>}
              </View>
              <Text style={s.colQte}>{ligne.quantite}</Text>
              <Text style={s.colMontant}>{formatPrix(ligne.prixUnitaireHtCentimes)}</Text>
              <Text style={s.colTaux}>{ligne.tauxTvaPb / 100} %</Text>
              <Text style={s.colMontant}>{formatPrix(ligne.totalTtcCentimes)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totaux}>
          <View style={s.total}>
            <Text>Total HT</Text>
            <Text>{formatPrix(totalHtCentimes)}</Text>
          </View>
          <View style={s.total}>
            <Text>TVA 20 %</Text>
            <Text>{formatPrix(totalTvaCentimes)}</Text>
          </View>
          <View style={s.totalFinal}>
            <Text>Total TTC</Text>
            <Text>{formatPrix(totalTtcCentimes)}</Text>
          </View>
          {commande.paidAt && (
            <Text style={[s.discret, { marginTop: 8 }]}>
              Payée le {formatDate(commande.paidAt)} par paiement en ligne (Stripe).
            </Text>
          )}
        </View>

        <View style={s.pied} fixed>
          <Text>
            {boutique.nom} · {societe.formeJuridique} au capital de {societe.capital} · RCS{" "}
            {societe.rcs}
          </Text>
          <Text style={{ marginTop: 4 }}>
            Site de démonstration réalisé pour un portfolio : cette facture ne correspond à aucune
            vente réelle.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/** Génère le PDF d'une commande payée (qui a donc une facture). */
export async function genererFacturePdf(commande: CommandeComplete): Promise<Buffer> {
  if (!commande.invoice) throw new Error(`La commande ${commande.number} n'a pas de facture.`);
  return renderToBuffer(<DocumentFacture commande={commande} facture={commande.invoice} />);
}
