import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireSimple } from "@/components/admin/formulaire-simple";
import { champsMarque } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { enregistrerMarque } from "@/server/actions/admin-catalogue";

export const metadata = { title: "Nouvelle marque" };

async function Formulaire() {
  await exigerAdmin("/admin/marques/nouvelle");
  return (
    <FormulaireSimple
      titre="Marque"
      action={enregistrerMarque}
      champs={champsMarque}
      valeurs={{ ordre: "0" }}
    />
  );
}

export default function PageNouvelle() {
  return (
    <>
      <EnTeteAdmin titre="Nouvelle marque" />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Formulaire />
      </Suspense>
    </>
  );
}
