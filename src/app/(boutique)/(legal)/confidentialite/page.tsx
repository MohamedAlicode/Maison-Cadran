import type { Metadata } from "next";
import Link from "next/link";
import {
  Encadre,
  PageEditoriale,
  Reperes,
  Rubrique,
  ValeurLegale,
} from "@/components/editorial/page-editoriale";
import { boutique } from "@/config/boutique";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Quelles données ${boutique.nom} collecte, pourquoi, combien de temps elles sont gardées, et comment exercer vos droits.`,
  alternates: { canonical: "/confidentialite" },
};

const { societe, contact } = boutique;

const rubriques = [
  {
    id: "responsable",
    titre: "Qui est responsable",
    contenu: (
      <p>
        Le responsable du traitement est <ValeurLegale valeur={societe.raisonSociale} />, éditeur du
        site. Pour toute question sur vos données :{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    ),
  },
  {
    id: "donnees",
    titre: "Ce que nous collectons, et pourquoi",
    contenu: (
      <Reperes
        lignes={[
          {
            terme: "Votre commande",
            detail:
              "Nom, adresse de livraison, e-mail et téléphone, pour préparer, expédier et suivre la commande, et établir la facture. Base légale : l'exécution du contrat de vente.",
          },
          {
            terme: "Votre compte",
            detail:
              "E-mail, adresses enregistrées et montres mises en favori, pour vous éviter de tout ressaisir. Base légale : l'exécution du contrat.",
          },
          {
            terme: "Le paiement",
            detail:
              "Traité directement par notre prestataire de paiement. Nous ne recevons jamais votre numéro de carte, seulement la confirmation du paiement.",
          },
          {
            terme: "Vos messages",
            detail:
              "Ce que vous nous écrivez, pour vous répondre. Base légale : notre intérêt légitime à assurer le service client.",
          },
          {
            terme: "Nos e-mails d'information",
            detail:
              "Uniquement si vous les avez demandés, et vous pouvez vous désinscrire à chaque envoi. Base légale : votre consentement.",
          },
        ]}
      />
    ),
  },
  {
    id: "durees",
    titre: "Combien de temps",
    contenu: (
      <ul>
        <li>
          <strong>Commandes et factures :</strong> dix ans, comme l&apos;exige le Code de commerce.
        </li>
        <li>
          <strong>Compte :</strong> jusqu&apos;à sa suppression, ou trois ans après votre dernière
          connexion.
        </li>
        <li>
          <strong>E-mails d&apos;information :</strong> trois ans après votre dernier contact avec
          nous, ou jusqu&apos;à votre désinscription.
        </li>
      </ul>
    ),
  },
  {
    id: "destinataires",
    titre: "Qui y a accès",
    contenu: (
      <>
        <p>
          Vos données ne sont jamais vendues. Elles sont transmises uniquement aux prestataires
          nécessaires au fonctionnement de la boutique, chacun pour sa seule mission : paiement
          (Stripe, et Klarna pour le paiement en plusieurs fois), livraison (Colissimo), hébergement
          du site et de la base de données, envoi des e-mails de commande.
        </p>
        <p>
          Certains de ces prestataires sont établis hors de l&apos;Union européenne. Les transferts
          sont alors encadrés par les garanties prévues par le RGPD.
        </p>
      </>
    ),
  },
  {
    id: "droits",
    titre: "Vos droits",
    contenu: (
      <>
        <p>
          Vous pouvez à tout moment accéder à vos données, les corriger, les faire supprimer,
          demander à en limiter l&apos;usage, vous y opposer, ou les récupérer dans un format
          lisible. Écrivez-nous à <a href={`mailto:${contact.email}`}>{contact.email}</a> : nous
          répondons dans un délai d&apos;un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation
          à la CNIL (cnil.fr).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    titre: "Cookies",
    contenu: (
      <p>
        Notre usage des cookies est expliqué sur la <Link href="/cookies">page cookies</Link>.
      </p>
    ),
  },
];

export default function PageConfidentialite() {
  return (
    <PageEditoriale
      titre="Politique de confidentialité"
      introduction={
        <p>
          Nous ne collectons que ce qui sert à vous vendre et vous livrer une montre. Voici le
          détail.
        </p>
      }
      rubriques={rubriques}
      miseAJour="12 octobre 2026"
    >
      <Encadre className="mb-12">
        Texte provisoire, à faire relire par un juriste avant l&apos;ouverture de la boutique.
      </Encadre>
      {rubriques.map(({ contenu, ...r }) => (
        <Rubrique key={r.id} {...r}>
          {contenu}
        </Rubrique>
      ))}
    </PageEditoriale>
  );
}
