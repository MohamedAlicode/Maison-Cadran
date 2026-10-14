import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormulaireCommander } from "@/components/panier/formulaire-commander";
import { LignePanier } from "@/components/panier/ligne-panier";
import {
  Montants,
  ProgressionLivraison,
  ReassurancePaiement,
} from "@/components/panier/recapitulatif";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { lirePanier } from "@/lib/panier/serveur";

export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false },
};

async function ContenuPanier({ searchParams }: Pick<PageProps<"/panier">, "searchParams">) {
  const [panier, { paiement }] = await Promise.all([lirePanier(), searchParams]);

  const avertissements = [
    paiement === "annule" &&
      "Le paiement a été annulé. Votre panier vous attend, rien n'a été débité.",
    panier.retirees > 0 &&
      (panier.retirees === 1
        ? "Une montre n'est plus disponible : elle a été retirée de votre panier."
        : `${panier.retirees} montres ne sont plus disponibles : elles ont été retirées de votre panier.`),
  ].filter(Boolean);

  if (panier.lignes.length === 0) {
    return (
      <div className="mt-10 max-w-xl">
        {avertissements.map((texte) => (
          <p key={String(texte)} role="status" className="mb-4 text-sm text-graphite">
            {texte}
          </p>
        ))}
        <p className="text-lg">Votre panier est vide pour le moment.</p>
        <Button asChild variante="secondaire" className="mt-6">
          <Link href="/montres">Découvrir les montres</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16 xl:gap-24">
      <section aria-labelledby="titre-articles">
        <h2 id="titre-articles" className="sr-only">
          Vos montres
        </h2>
        {avertissements.map((texte) => (
          <p
            key={String(texte)}
            role="status"
            className="mb-6 border-l-2 border-cadran bg-blanc px-4 py-3 text-sm"
          >
            {texte}
          </p>
        ))}
        <ul className="divide-y divide-filet border-y border-filet [&>li]:py-6">
          {panier.lignes.map((ligne) => (
            <LignePanier key={ligne.id} ligne={ligne} />
          ))}
        </ul>
        <Link
          href="/montres"
          className="mt-6 inline-block text-sm text-graphite underline decoration-filet-fort underline-offset-4 hover:text-encre"
        >
          Continuer mes achats
        </Link>
      </section>

      <section aria-labelledby="titre-recapitulatif" className="lg:sticky lg:top-28 lg:self-start">
        <div className="space-y-6 bg-blanc p-6 md:p-8">
          <h2 id="titre-recapitulatif" className="font-serif text-2xl">
            Récapitulatif
          </h2>
          <ProgressionLivraison montants={panier} />
          <Montants montants={panier} />
          <FormulaireCommander />
          <ReassurancePaiement />
        </div>
      </section>
    </div>
  );
}

function PanierSquelette() {
  return (
    <div aria-hidden className="mt-8 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16 xl:gap-24">
      <div className="space-y-6 border-y border-filet py-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="size-24 bg-filet/60 md:size-32" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 bg-filet/60" />
              <div className="h-4 w-1/3 bg-filet/60" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-96 bg-blanc" />
    </div>
  );
}

export default function PagePanier({ searchParams }: PageProps<"/panier">) {
  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-4xl md:text-5xl">Votre panier</h1>
      <Suspense fallback={<PanierSquelette />}>
        <ContenuPanier searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
