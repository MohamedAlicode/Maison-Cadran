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
  title: "Mentions légales",
  description: `Éditeur, hébergeur et propriété intellectuelle du site ${boutique.nom}.`,
  alternates: { canonical: "/mentions-legales" },
};

const { societe, contact } = boutique;

const rubriques = [
  {
    id: "editeur",
    titre: "Éditeur du site",
    contenu: (
      <Reperes
        lignes={[
          { terme: "Raison sociale", detail: <ValeurLegale valeur={societe.raisonSociale} /> },
          {
            terme: "Forme et capital",
            detail: (
              <>
                <ValeurLegale valeur={societe.formeJuridique} />, capital de{" "}
                <ValeurLegale valeur={societe.capital} />
              </>
            ),
          },
          { terme: "Siège social", detail: <ValeurLegale valeur={societe.siege} /> },
          { terme: "RCS", detail: <ValeurLegale valeur={societe.rcs} /> },
          { terme: "SIRET", detail: <ValeurLegale valeur={societe.siret} /> },
          {
            terme: "TVA intracommunautaire",
            detail: <ValeurLegale valeur={societe.tvaIntracom} />,
          },
          {
            terme: "Directeur de la publication",
            detail: <ValeurLegale valeur={societe.directeurPublication} />,
          },
          {
            terme: "Contact",
            detail: (
              <>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>, {contact.telephone}
              </>
            ),
          },
        ]}
      />
    ),
  },
  {
    id: "hebergeur",
    titre: "Hébergement",
    contenu: (
      <p>
        Le site est hébergé par <ValeurLegale valeur={societe.hebergeur} />.
      </p>
    ),
  },
  {
    id: "propriete",
    titre: "Propriété intellectuelle",
    contenu: (
      <>
        <p>
          Les textes, illustrations et la mise en page du site appartiennent à {boutique.nom}. Toute
          reproduction sans autorisation écrite est interdite.
        </p>
        <p>
          Les noms de marques horlogères cités sur le site appartiennent à leurs propriétaires
          respectifs. Ils sont utilisés uniquement pour désigner les montres proposées à la vente.
        </p>
      </>
    ),
  },
  {
    id: "visuels",
    titre: "Crédits des visuels",
    contenu: (
      <p>
        Les illustrations de montres sont dessinées pour {boutique.nom} à partir des
        caractéristiques publiées par les fabricants. Elles ne remplacent pas une photographie du
        produit.
      </p>
    ),
  },
  {
    id: "donnees",
    titre: "Données personnelles et cookies",
    contenu: (
      <p>
        Voir notre <Link href="/confidentialite">politique de confidentialité</Link> et notre{" "}
        <Link href="/cookies">page cookies</Link>.
      </p>
    ),
  },
];

export default function PageMentionsLegales() {
  return (
    <PageEditoriale
      titre="Mentions légales"
      introduction={<p>Qui édite ce site, qui l&apos;héberge, et à qui appartient son contenu.</p>}
      rubriques={rubriques}
      miseAJour="12 octobre 2026"
    >
      <Encadre className="mb-12">
        Les mentions surlignées seront complétées avant l&apos;ouverture de la boutique.
      </Encadre>
      {rubriques.map(({ contenu, ...r }) => (
        <Rubrique key={r.id} {...r}>
          {contenu}
        </Rubrique>
      ))}
    </PageEditoriale>
  );
}
