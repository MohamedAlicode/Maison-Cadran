import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BoutonSupprimer } from "@/components/admin/bouton-supprimer";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { champsMarque, marquePourEdition } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerMarque, supprimerMarque } from "@/server/actions/admin-catalogue";

export const metadata = { title: "Modifier une marque" };
// Page privée rendue à la demande : pas de coquille statique à valider pour un identifiant.
export const instant = false;

async function Edition({ params }: PageProps<"/admin/marques/[id]">) {
  const { id } = await params;
  await exigerAdmin(`/admin/marques/${id}`);
  const fiche = await marquePourEdition(id);
  if (!fiche) notFound();
  return (
    <>
      <EnTeteAdmin titre={fiche.nom} />
      <FormulaireSimple
        titre="Marque"
        action={enregistrerMarque}
        champs={champsMarque}
        valeurs={fiche.valeurs}
      />
      <div className="mt-10 border-t border-filet pt-6">
        <BoutonSupprimer
          supprimer={supprimerMarque.bind(null, id)}
          libelle="Supprimer la marque"
          confirmation="Supprimer cette marque ?"
        />
      </div>
    </>
  );
}

export default function PageEdition(props: PageProps<"/admin/marques/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-64" />}>
      <Edition {...props} />
    </Suspense>
  );
}
