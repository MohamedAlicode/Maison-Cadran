import type { Metadata } from "next";
import Link from "next/link";
import { Encadre, PageEditoriale, Rubrique } from "@/components/editorial/page-editoriale";
import { boutique } from "@/config/boutique";

const jours = boutique.retours.joursRetractation;

export const metadata: Metadata = {
  title: "Retours et rétractation",
  description: `${jours} jours pour changer d'avis, frais de retour offerts : la marche à suivre pour renvoyer une montre achetée chez ${boutique.nom}.`,
  alternates: { canonical: "/retours" },
};

const rubriques = [
  {
    id: "delai",
    titre: `${jours} jours pour changer d'avis`,
    contenu: (
      <>
        <p>
          Vous disposez de {jours} jours à compter de la réception de votre montre pour nous la
          renvoyer, sans avoir à vous justifier. C&apos;est le droit de rétractation prévu par le
          Code de la consommation pour tout achat à distance.
        </p>
        <p>
          <strong>Le retour est gratuit</strong> : nous vous envoyons une étiquette prépayée, vous
          n&apos;avancez aucun frais.
        </p>
      </>
    ),
  },
  {
    id: "conditions",
    titre: "Dans quel état la renvoyer",
    contenu: (
      <>
        <p>
          Vous pouvez sortir la montre de sa boîte, la regarder, la mettre au poignet pour juger de
          sa taille : c&apos;est fait pour ça. Pour qu&apos;elle puisse être revendue neuve, nous
          vous demandons en revanche :
        </p>
        <ul>
          <li>de ne pas la porter au quotidien ;</li>
          <li>de laisser en place les films de protection et les scellés ;</li>
          <li>
            de la renvoyer complète, dans son écrin, avec la carte de garantie, les notices et les
            maillons éventuellement retirés.
          </li>
        </ul>
        <p>
          Si la montre revient abîmée ou visiblement portée, nous pouvons retenir sur le
          remboursement la perte de valeur constatée. Nous vous en informons avant tout
          remboursement partiel.
        </p>
      </>
    ),
  },
  {
    id: "marche",
    titre: "La marche à suivre",
    contenu: (
      <ol>
        <li>
          Écrivez-nous à <a href={`mailto:${boutique.contact.email}`}>{boutique.contact.email}</a>{" "}
          en indiquant votre numéro de commande. Le formulaire type de rétractation n&apos;est pas
          obligatoire : un simple message suffit.
        </li>
        <li>Nous vous répondons avec une étiquette Colissimo prépayée.</li>
        <li>
          Emballez la montre dans son écrin, puis dans le carton d&apos;origine ou un carton rigide,
          et déposez le colis en bureau de poste. Gardez la preuve de dépôt.
        </li>
        <li>
          Dès réception, nous vérifions la montre et vous confirmons le remboursement par e-mail.
        </li>
      </ol>
    ),
  },
  {
    id: "remboursement",
    titre: "Le remboursement",
    contenu: (
      <>
        <p>
          Nous vous remboursons au plus tard {jours} jours après avoir été informés de votre
          rétractation, sur le moyen de paiement utilisé lors de la commande. Si vous avez payé en
          plusieurs fois, les échéances restantes sont annulées.
        </p>
        <p>
          Les frais de livraison payés à la commande vous sont rendus. La loi nous autorise à
          attendre d&apos;avoir reçu la montre avant de rembourser : c&apos;est ce que nous faisons.
        </p>
      </>
    ),
  },
  {
    id: "echange",
    titre: "Un échange plutôt qu'un retour",
    contenu: (
      <p>
        Une autre taille de boîtier, un autre cadran ? Le plus rapide est de commander la nouvelle
        montre, puis de nous renvoyer la première selon la marche ci-dessus : le retour reste
        gratuit.
      </p>
    ),
  },
  {
    id: "garantie",
    titre: `Après ${jours} jours : la garantie`,
    contenu: (
      <p>
        Passé le délai de rétractation, une panne ou un défaut relève de la{" "}
        <Link href="/faq#garantie">garantie de {boutique.garantieMois / 12} ans</Link>, qui couvre
        le mouvement et les défauts de fabrication. L&apos;usure normale, les chocs et les traces
        d&apos;eau au-delà de l&apos;étanchéité indiquée n&apos;en font pas partie.
      </p>
    ),
  },
];

export default function PageRetours() {
  return (
    <PageEditoriale
      titre="Retours et rétractation"
      introduction={
        <p>
          Une montre se juge au poignet. Si celle que vous avez reçue ne vous convient pas, vous
          avez {jours} jours pour nous la renvoyer, et le retour est à nos frais.
        </p>
      }
      rubriques={rubriques}
      miseAJour="12 octobre 2026"
    >
      {rubriques.map(({ contenu, ...r }) => (
        <Rubrique key={r.id} {...r}>
          {contenu}
        </Rubrique>
      ))}
      <Encadre>
        Les conditions détaillées figurent dans nos{" "}
        <Link href="/cgv#retractation" className="text-cadran underline underline-offset-4">
          conditions générales de vente
        </Link>
        .
      </Encadre>
    </PageEditoriale>
  );
}
