import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireProduit } from "@/components/admin/formulaire-produit";
import { nouveauProduit, optionsCatalogue } from "@/lib/admin/catalogue";
import { exigerAdmin } from "@/lib/admin/serveur";

export const metadata = { title: "Nouvelle montre" };

async function Formulaire() {
  await exigerAdmin("/admin/produits/nouveau");
  const { marques, collections } = await optionsCatalogue();
  return (
    <FormulaireProduit
      produit={nouveauProduit}
      photos={[]}
      collectionsCochees={[]}
      marques={marques}
      collections={collections}
    />
  );
}

export default function PageNouveauProduit() {
  return (
    <>
      <EnTeteAdmin titre="Nouvelle montre" />
      <Suspense fallback={<div aria-hidden className="h-96" />}>
        <Formulaire />
      </Suspense>
    </>
  );
}
