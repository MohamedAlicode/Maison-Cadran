import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogueSquelette, VueCatalogue } from "@/components/catalogue/vue-catalogue";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Toutes les montres",
  description:
    "Montres automatiques, quartz et solaires de 100 à 2 000 € : Tissot, Hamilton, Seiko, Citizen, Orient, Certina, Mido, Frederique Constant. Filtrez par marque, prix, mouvement, diamètre et étanchéité.",
  // Les combinaisons de filtres pointent vers la page principale pour éviter le contenu dupliqué.
  alternates: { canonical: "/montres" },
};

export default function PageCatalogue({ searchParams }: PageProps<"/montres">) {
  return (
    <Container className="py-10 md:py-14">
      <Breadcrumb miettes={[{ libelle: "Accueil", href: "/" }, { libelle: "Montres" }]} />
      <div className="mt-6 mb-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl">Toutes les montres</h1>
        <p className="mt-4 leading-relaxed text-graphite">
          Chaque montre est neuve, vérifiée et livrée dans son écrin d&apos;origine. Affinez par
          marque, budget ou mouvement pour trouver celle qui vous ressemble.
        </p>
      </div>
      <Suspense fallback={<CatalogueSquelette />}>
        <VueCatalogue searchParams={searchParams} chemin="/montres" />
      </Suspense>
    </Container>
  );
}
