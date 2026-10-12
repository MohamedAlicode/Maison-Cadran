import type { Metadata } from "next";
import Link from "next/link";
import {
  Encadre,
  PageEditoriale,
  Rubrique,
  ValeurLegale,
} from "@/components/editorial/page-editoriale";
import { boutique } from "@/config/boutique";
import { formatPrix, formatPrixCourt } from "@/lib/prix";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Les conditions qui encadrent vos achats chez ${boutique.nom} : prix, paiement, livraison, rétractation et garanties.`,
  alternates: { canonical: "/cgv" },
};

const { societe, livraison, retours, contact } = boutique;

const rubriques = [
  {
    id: "objet",
    titre: "1. Objet",
    contenu: (
      <p>
        Ces conditions s&apos;appliquent à toute commande passée sur le site {boutique.nom} par un
        consommateur, pour une livraison en France métropolitaine. Passer commande vaut acceptation
        de ces conditions, dans leur version en ligne au jour de la commande.
      </p>
    ),
  },
  {
    id: "vendeur",
    titre: "2. Le vendeur",
    contenu: (
      <p>
        Le site est édité par <ValeurLegale valeur={societe.raisonSociale} />,{" "}
        <ValeurLegale valeur={societe.formeJuridique} /> au capital de{" "}
        <ValeurLegale valeur={societe.capital} />, dont le siège est situé{" "}
        <ValeurLegale valeur={societe.siege} />, immatriculée au RCS de{" "}
        <ValeurLegale valeur={societe.rcs} />. Contact :{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>, {contact.telephone}.
      </p>
    ),
  },
  {
    id: "produits",
    titre: "3. Les montres",
    contenu: (
      <p>
        Toutes les montres vendues sont neuves. Leurs caractéristiques essentielles (mouvement,
        dimensions, matières, étanchéité) figurent sur chaque fiche. Les visuels sont aussi fidèles
        que possible ; une légère différence de teinte selon l&apos;écran ne constitue pas un
        défaut. Les offres valent dans la limite des stocks affichés.
      </p>
    ),
  },
  {
    id: "prix",
    titre: "4. Prix",
    contenu: (
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises (TVA française incluse). Les frais
        de livraison s&apos;y ajoutent, sauf au-delà de{" "}
        {formatPrixCourt(livraison.seuilGratuitCentimes)} d&apos;achat : ils s&apos;élèvent à{" "}
        {formatPrix(livraison.fraisCentimes)} et sont indiqués avant la validation de la commande.
        Le prix facturé est celui affiché au moment de la commande.
      </p>
    ),
  },
  {
    id: "commande",
    titre: "5. Commande",
    contenu: (
      <p>
        Vous choisissez vos montres, vérifiez le récapitulatif de votre panier, renseignez votre
        adresse de livraison puis payez. Vous pouvez corriger chaque étape avant le paiement. La
        commande est définitive à la confirmation du paiement ; un e-mail récapitulatif vous est
        alors envoyé.
      </p>
    ),
  },
  {
    id: "paiement",
    titre: "6. Paiement",
    contenu: (
      <p>
        Le paiement se fait par carte bancaire, au moyen d&apos;un prestataire de paiement sécurisé
        : {boutique.nom} n&apos;a jamais accès à vos données de carte. Le paiement en 3 ou 4 fois
        est proposé par Klarna, selon ses propres conditions, que vous acceptez au moment du
        paiement.
      </p>
    ),
  },
  {
    id: "livraison",
    titre: "7. Livraison",
    contenu: (
      <>
        <p>
          Les montres sont livrées en France métropolitaine par {livraison.transporteur}, à
          l&apos;adresse indiquée lors de la commande. Le délai est de {livraison.delaiLivraison}. À
          défaut de livraison dans les trente jours suivant la commande, vous pouvez annuler la
          commande et être remboursé.
        </p>
        <p>
          Vérifiez le colis devant le livreur. S&apos;il est abîmé, notez vos réserves sur le bon de
          livraison et prévenez-nous sous trois jours.
        </p>
      </>
    ),
  },
  {
    id: "retractation",
    titre: "8. Droit de rétractation",
    contenu: (
      <>
        <p>
          Vous disposez de {retours.joursRetractation} jours à compter de la réception de la montre
          pour exercer votre droit de rétractation, sans avoir à le justifier (articles L221-18 et
          suivants du Code de la consommation). Il suffit de nous l&apos;indiquer par e-mail, avec
          ou sans le formulaire type.
        </p>
        <p>
          Les frais de retour sont pris en charge par {boutique.nom}. La montre doit revenir
          complète, non portée, films de protection et scellés intacts. Nous vous remboursons
          l&apos;intégralité des sommes versées, frais de livraison inclus, dans les{" "}
          {retours.joursRetractation} jours suivant votre demande, au plus tard à réception de la
          montre. La marche à suivre figure sur la page <Link href="/retours">Retours</Link>.
        </p>
      </>
    ),
  },
  {
    id: "garanties",
    titre: "9. Garanties",
    contenu: (
      <p>
        Toutes les montres bénéficient de la garantie légale de conformité, pendant deux ans à
        compter de la livraison (articles L217-3 et suivants du Code de la consommation), et de la
        garantie des vices cachés (articles 1641 et suivants du Code civil). Pour la faire jouer,
        écrivez-nous à <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    ),
  },
  {
    id: "donnees",
    titre: "10. Données personnelles",
    contenu: (
      <p>
        Les données collectées lors de la commande servent à la traiter et à la livrer. Leur usage
        et vos droits sont détaillés dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
  {
    id: "litiges",
    titre: "11. Litiges et médiation",
    contenu: (
      <p>
        Ces conditions sont soumises au droit français. En cas de désaccord, écrivez-nous
        d&apos;abord : nous chercherons une solution amiable. À défaut, vous pouvez recourir
        gratuitement au médiateur de la consommation : <ValeurLegale valeur={societe.mediateur} />.
      </p>
    ),
  },
];

export default function PageCgv() {
  return (
    <PageEditoriale
      titre="Conditions générales de vente"
      introduction={
        <p>
          Ce qui s&apos;applique quand vous achetez une montre chez nous, écrit aussi simplement que
          possible.
        </p>
      }
      rubriques={rubriques}
      miseAJour="12 octobre 2026"
    >
      <Encadre className="mb-12">
        Texte provisoire, à faire relire par un juriste avant l&apos;ouverture de la boutique. Les
        mentions surlignées restent à compléter.
      </Encadre>
      {rubriques.map(({ contenu, ...r }) => (
        <Rubrique key={r.id} {...r}>
          {contenu}
        </Rubrique>
      ))}
    </PageEditoriale>
  );
}
