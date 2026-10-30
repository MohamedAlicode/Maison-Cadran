import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FormulaireIdentifiants } from "@/components/compte/formulaire-identifiants";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { cheminRetour } from "@/lib/compte/regles";
import { clientConnecte } from "@/lib/compte/serveur";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false },
};

async function ContenuInscription({
  searchParams,
}: Pick<PageProps<"/inscription">, "searchParams">) {
  const retour = cheminRetour((await searchParams).retour);
  if (await clientConnecte()) redirect(retour);

  return (
    <>
      <div className="mt-8">
        <FormulaireIdentifiants mode="inscription" retour={retour} />
      </div>
      <p className="mt-6 text-sm text-graphite">
        Déjà un compte ?{" "}
        <TextLink href={`/connexion?retour=${encodeURIComponent(retour)}`}>Se connecter</TextLink>
      </p>
    </>
  );
}

export default function PageInscription({ searchParams }: PageProps<"/inscription">) {
  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-4xl md:text-5xl">Créer un compte</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Suivez vos commandes, gardez vos adresses et mettez des montres de côté.
        </p>
        <Suspense fallback={<div aria-hidden className="h-72" />}>
          <ContenuInscription searchParams={searchParams} />
        </Suspense>
        <p className="mt-8 text-sm text-graphite">L&apos;achat reste possible sans compte.</p>
      </div>
    </Container>
  );
}
