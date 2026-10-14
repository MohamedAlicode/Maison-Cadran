// Gabarit commun des e-mails : fond acier, carte blanche, en-tête serif, pied de réassurance.
// Les clients mail ignorent les feuilles de style : tout est en style en ligne.
import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { boutique } from "@/config/boutique";
import { couleursImprimees as c } from "@/config/couleurs-imprimees";

export const policeTitre = "'Instrument Serif', Georgia, 'Times New Roman', serif";
export const policeTexte = "'Hanken Grotesk', 'Helvetica Neue', Helvetica, sans-serif";

export const styles = {
  titre: {
    fontFamily: policeTitre,
    fontWeight: 400,
    fontSize: "30px",
    lineHeight: "1.1",
    color: c.encre,
    margin: "0 0 16px",
  },
  texte: { fontSize: "16px", lineHeight: "1.5", color: c.encre, margin: "0 0 16px" },
  discret: { fontSize: "13px", lineHeight: "1.5", color: c.graphite, margin: 0 },
  libelle: {
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: c.graphite,
    margin: "0 0 8px",
  },
  filet: { borderColor: c.filet, margin: "24px 0" },
} satisfies Record<string, CSSProperties>;

/** `rappels` : garantie et livraison, retirés quand la commande ne sera pas livrée. */
export function GabaritEmail({
  apercu,
  rappels = true,
  children,
}: {
  apercu: string;
  rappels?: boolean;
  children: ReactNode;
}) {
  return (
    <Html lang="fr">
      <Head>
        {/* Seuls certains clients (Apple Mail, iOS) chargent ces polices ; les autres
            retombent sur Georgia et Helvetica, prévues dans les piles de polices. */}
        <Font
          fontFamily="Instrument Serif"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf",
            format: "truetype",
          }}
        />
        <Font
          fontFamily="Hanken Grotesk"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_Ncs2Zq5vBJ.ttf",
            format: "truetype",
          }}
        />
      </Head>
      <Preview>{apercu}</Preview>
      <Body
        style={{ backgroundColor: c.acier, fontFamily: policeTexte, margin: 0, padding: "32px 0" }}
      >
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Text
            style={{
              fontFamily: policeTitre,
              fontSize: "20px",
              letterSpacing: "0.08em",
              textAlign: "center",
              color: c.encre,
              margin: "0 0 24px",
            }}
          >
            MAISON CADRAN
          </Text>
          <Section style={{ backgroundColor: c.blanc, padding: "40px 32px" }}>{children}</Section>
          <Section style={{ padding: "24px 32px", textAlign: "center" }}>
            {rappels && (
              <>
                <Text style={styles.discret}>
                  Garantie {boutique.garantieMois / 12} ans · Retours gratuits sous{" "}
                  {boutique.retours.joursRetractation} jours · Livraison assurée contre signature
                </Text>
                <Hr style={styles.filet} />
              </>
            )}
            <Text style={styles.discret}>
              Une question ? Écrivez-nous à {boutique.contact.email}, {boutique.contact.horaires}.
            </Text>
            <Text style={{ ...styles.discret, marginTop: "12px" }}>
              Site de démonstration réalisé pour un portfolio : aucune vente réelle.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
