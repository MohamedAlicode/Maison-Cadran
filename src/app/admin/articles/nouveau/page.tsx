import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { champsArticle } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerArticle } from "@/server/actions/admin-articles";

export const metadata = { title: "Nouvel article" };

async function Formulaire() {
  await exigerAdmin("/admin/articles/nouveau");
  return (
    <FormulaireSimple
      titre="Article"
      action={enregistrerArticle}
      champs={champsArticle}
      valeurs={{}}
    />
  );
}

export default function PageNouveau() {
  return (
    <>
      <EnTeteAdmin titre="Nouvel article" />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Formulaire />
      </Suspense>
    </>
  );
}
