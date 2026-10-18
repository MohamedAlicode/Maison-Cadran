import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireCodePromo } from "@/components/admin/formulaire-code-promo";
import { nouveauCode } from "@/lib/admin/codes-promo";
import { exigerAdmin } from "@/lib/admin/serveur";

export const metadata = { title: "Nouveau code promo" };

async function Formulaire() {
  await exigerAdmin("/admin/codes-promo/nouveau");
  return <FormulaireCodePromo code={nouveauCode} />;
}

export default function PageNouveau() {
  return (
    <>
      <EnTeteAdmin titre="Nouveau code promo" />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Formulaire />
      </Suspense>
    </>
  );
}
