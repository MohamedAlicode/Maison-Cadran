import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BoutonSupprimer } from "@/components/admin/bouton-supprimer";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { champsCollection, collectionPourEdition } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerCollection, supprimerCollection } from "@/server/actions/admin-catalogue";

export const metadata = { title: "Modifier une collection" };
// Page privée rendue à la demande : pas de coquille statique à valider pour un identifiant.
export const instant = false;

async function Edition({ params }: PageProps<"/admin/collections/[id]">) {
  const { id } = await params;
  await exigerAdmin(`/admin/collections/${id}`);
  const fiche = await collectionPourEdition(id);
  if (!fiche) notFound();
  return (
    <>
      <EnTeteAdmin titre={fiche.nom} />
      <FormulaireSimple
        titre="Collection"
        action={enregistrerCollection}
        champs={champsCollection}
        valeurs={fiche.valeurs}
      />
      <div className="mt-10 border-t border-filet pt-6">
        <BoutonSupprimer
          supprimer={supprimerCollection.bind(null, id)}
          libelle="Supprimer la collection"
          confirmation="Supprimer cette collection ? Les montres restent en ligne."
        />
      </div>
    </>
  );
}

export default function PageEdition(props: PageProps<"/admin/collections/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-64" />}>
      <Edition {...props} />
    </Suspense>
  );
}
