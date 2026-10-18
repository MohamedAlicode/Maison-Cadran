import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BoutonSupprimer } from "@/components/admin/bouton-supprimer";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireCodePromo } from "@/components/admin/formulaire-code-promo";
import { codePourEdition } from "@/lib/admin/codes-promo";
import { exigerAdmin } from "@/lib/admin/serveur";
import { supprimerCodePromo } from "@/server/actions/admin-codes-promo";

export const metadata = { title: "Modifier un code promo" };
// Page privée rendue à la demande : pas de coquille statique à valider pour un identifiant.
export const instant = false;

async function Edition({ params }: PageProps<"/admin/codes-promo/[id]">) {
  const { id } = await params;
  await exigerAdmin(`/admin/codes-promo/${id}`);
  const fiche = await codePourEdition(id);
  if (!fiche) notFound();
  const { utilisations, ...code } = fiche;
  return (
    <>
      <EnTeteAdmin titre={fiche.code}>
        <p className="chiffres mt-2 text-graphite">
          Utilisé {utilisations} fois sur des commandes payées.
        </p>
      </EnTeteAdmin>
      <FormulaireCodePromo code={code} />
      <div className="mt-10 border-t border-filet pt-6">
        <BoutonSupprimer
          supprimer={supprimerCodePromo.bind(null, id)}
          libelle="Supprimer le code"
          confirmation="Supprimer ce code ?"
        />
      </div>
    </>
  );
}

export default function PageEdition(props: PageProps<"/admin/codes-promo/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-64" />}>
      <Edition {...props} />
    </Suspense>
  );
}
