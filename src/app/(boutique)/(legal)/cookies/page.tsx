import type { Metadata } from "next";
import Link from "next/link";
import {
  MentionDemo,
  PageEditoriale,
  Reperes,
  Rubrique,
} from "@/components/editorial/page-editoriale";
import { boutique } from "@/config/boutique";

export const metadata: Metadata = {
  title: "Cookies",
  description: `${boutique.nom} n'utilise aucun cookie publicitaire ni de suivi. Le détail des cookies nécessaires au fonctionnement du site.`,
  alternates: { canonical: "/cookies" },
};

const rubriques = [
  {
    id: "principe",
    titre: "Aucun cookie de suivi",
    contenu: (
      <>
        <p>
          Nous ne déposons aucun cookie publicitaire, aucun cookie de réseau social et aucun cookie
          de mesure d&apos;audience. C&apos;est pourquoi le site ne vous affiche pas de bandeau de
          consentement.
        </p>
      </>
    ),
  },
  {
    id: "necessaires",
    titre: "Les cookies nécessaires",
    contenu: (
      <>
        <p>
          Quelques cookies servent uniquement à faire fonctionner la boutique. La loi les dispense
          de consentement, car le site ne marcherait pas sans eux.
        </p>
        <Reperes
          lignes={[
            { terme: "Panier", detail: "Garde les montres de votre panier d'une page à l'autre." },
            {
              terme: "Connexion",
              detail: "Vous garde connecté à votre compte pendant votre visite.",
            },
            {
              terme: "Paiement",
              detail:
                "Déposés par notre prestataire de paiement pendant le règlement, pour sécuriser la transaction et prévenir la fraude.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "navigateur",
    titre: "Les gérer depuis votre navigateur",
    contenu: (
      <p>
        Vous pouvez supprimer ou bloquer les cookies dans les réglages de votre navigateur. Bloquer
        les cookies nécessaires empêche toutefois d&apos;utiliser le panier et de vous connecter.
        Pour le reste de vos données, voir notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
];

export default function PageCookies() {
  return (
    <PageEditoriale
      titre="Cookies"
      introduction={<p>Court, parce qu&apos;il y a peu à dire : nous ne vous suivons pas.</p>}
      rubriques={rubriques}
      miseAJour="12 octobre 2026"
    >
      <MentionDemo className="mb-12" />
      {rubriques.map(({ contenu, ...r }) => (
        <Rubrique key={r.id} {...r}>
          {contenu}
        </Rubrique>
      ))}
    </PageEditoriale>
  );
}
