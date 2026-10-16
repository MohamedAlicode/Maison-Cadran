import { Button, Text } from "@react-email/components";
import { GabaritEmail, styles } from "./gabarit";

/** Lien magique : aucun mot de passe à retenir, l'accès à la boîte mail prouve l'identité. */
export function EmailLienConnexion({ url }: { url: string }) {
  return (
    <GabaritEmail apercu="Votre lien pour vous connecter à Maison Cadran." rappels={false}>
      <Text style={styles.titre}>Connexion à votre compte</Text>
      <Text style={styles.texte}>
        Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien fonctionne une seule fois,
        pendant 24 heures.
      </Text>
      <Button href={url} style={styles.bouton}>
        Me connecter
      </Button>
      <Text style={{ ...styles.discret, marginTop: "24px" }}>
        Vous n&apos;avez rien demandé ? Ignorez simplement cet e-mail : personne ne pourra se
        connecter sans ce lien.
      </Text>
    </GabaritEmail>
  );
}
