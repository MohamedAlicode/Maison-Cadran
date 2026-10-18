import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { champsCollection } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerCollection } from "@/server/actions/admin-catalogue";

export const metadata = { title: "Nouvelle collection" };

async function Formulaire() {
  await exigerAdmin("/admin/collections/nouvelle");
  return (
    <FormulaireSimple
      titre="Collection"
      action={enregistrerCollection}
      champs={champsCollection}
      valeurs={{ ordre: "0" }}
    />
  );
}

export default function PageNouvelle() {
  return (
    <>
      <EnTeteAdmin titre="Nouvelle collection" />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Formulaire />
      </Suspense>
    </>
  );
}
