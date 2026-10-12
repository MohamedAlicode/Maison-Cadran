import type { Metadata } from "next";
import { PageEditoriale } from "@/components/editorial/page-editoriale";
import { TextLink } from "@/components/ui/text-link";
import { boutique } from "@/config/boutique";

const { contact } = boutique;

export const metadata: Metadata = {
  title: "Contact",
  description: `Une question sur une montre, une commande ou un retour ? Écrivez à ${boutique.nom} ou appelez-nous ${contact.horaires}.`,
  alternates: { canonical: "/contact" },
};

const raccourcis = [
  { href: "/faq", libelle: "Questions fréquentes" },
  { href: "/retours", libelle: "Retourner une montre" },
  { href: "/guide", libelle: "Guide d'achat" },
];

export default function PageContact() {
  return (
    <PageEditoriale
      titre="Nous contacter"
      introduction={
        <p>
          Une hésitation entre deux modèles, une question sur une commande ou un retour :
          écrivez-nous ou appelez-nous, nous vous répondons.
        </p>
      }
    >
      <dl className="border-t border-filet">
        <div className="border-b border-filet py-8">
          <dt className="text-sm text-graphite">Par e-mail</dt>
          <dd className="mt-2">
            <a
              href={`mailto:${contact.email}`}
              className="font-serif text-3xl break-all transition-colors duration-(--duree-courte) ease-maison hover:text-cadran md:text-4xl"
            >
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="border-b border-filet py-8">
          <dt className="text-sm text-graphite">Par téléphone</dt>
          <dd className="mt-2">
            <a
              href={`tel:${contact.telephone.replace(/\s/g, "")}`}
              className="chiffres font-serif text-3xl transition-colors duration-(--duree-courte) ease-maison hover:text-cadran md:text-4xl"
            >
              {contact.telephone}
            </a>
            <p className="mt-2 text-graphite">
              {contact.horaires.charAt(0).toUpperCase() + contact.horaires.slice(1)}.
            </p>
          </dd>
        </div>
      </dl>

      <section aria-labelledby="preparer" className="mt-14">
        <h2 id="preparer" className="text-2xl leading-titre md:text-3xl">
          Pour une réponse plus rapide
        </h2>
        <div className="redaction mt-5">
          <p>Indiquez-nous, selon votre question :</p>
          <ul>
            <li>votre numéro de commande, s&apos;il s&apos;agit d&apos;une commande passée ;</li>
            <li>
              le nom de la montre ou le lien de sa fiche, s&apos;il s&apos;agit d&apos;un modèle ;
            </li>
            <li>une photo, s&apos;il s&apos;agit d&apos;un défaut.</li>
          </ul>
        </div>
      </section>

      <nav aria-label="Réponses déjà prêtes" className="mt-14 border-t border-filet pt-8">
        <p className="text-sm text-graphite">La réponse est peut-être déjà là :</p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
          {raccourcis.map((r) => (
            <li key={r.href}>
              <TextLink href={r.href}>{r.libelle}</TextLink>
            </li>
          ))}
        </ul>
      </nav>
    </PageEditoriale>
  );
}
