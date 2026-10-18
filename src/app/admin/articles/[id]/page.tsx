import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BoutonSupprimer } from "@/components/admin/bouton-supprimer";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { TextLink } from "@/components/ui/text-link";
import { articlePourEdition, champsArticle } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerArticle, supprimerArticle } from "@/server/actions/admin-articles";

export const metadata = { title: "Modifier un article" };
// Page privée rendue à la demande : pas de coquille statique à valider pour un identifiant.
export const instant = false;

async function Edition({ params }: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  await exigerAdmin(`/admin/articles/${id}`);
  const fiche = await articlePourEdition(id);
  if (!fiche) notFound();
  return (
    <>
      <EnTeteAdmin titre={fiche.titre}>
        {fiche.publie && (
          <TextLink href={`/guide/${fiche.slug}`} className="mt-2 inline-block">
            Voir l&apos;article
          </TextLink>
        )}
      </EnTeteAdmin>
      <FormulaireSimple
        titre="Article"
        action={enregistrerArticle}
        champs={champsArticle}
        valeurs={fiche.valeurs}
      />
      <div className="mt-10 border-t border-filet pt-6">
        <BoutonSupprimer
          supprimer={supprimerArticle.bind(null, id)}
          libelle="Supprimer l'article"
          confirmation="Supprimer cet article ?"
        />
      </div>
    </>
  );
}

export default function PageEdition(props: PageProps<"/admin/articles/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-64" />}>
      <Edition {...props} />
    </Suspense>
  );
}
