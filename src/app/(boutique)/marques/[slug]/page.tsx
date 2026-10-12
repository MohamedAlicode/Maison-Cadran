import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogueSquelette, VueCatalogue } from "@/components/catalogue/vue-catalogue";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { listeMarques, marqueParSlug } from "@/lib/catalogue";

export async function generateStaticParams() {
  const marques = await listeMarques();
  return marques.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/marques/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const marque = await marqueParSlug(slug);
  if (!marque) return {};
  return {
    title: `Montres ${marque.name}`,
    description: `${marque.description} Découvrez notre sélection de montres ${marque.name}, livrées avec écrin et garantie.`,
    alternates: { canonical: `/marques/${marque.slug}` },
  };
}

async function EnTeteMarque({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const marque = await marqueParSlug(slug);
  if (!marque) notFound();
  return (
    <>
      <Breadcrumb
        miettes={[
          { libelle: "Accueil", href: "/" },
          { libelle: "Marques", href: "/marques" },
          { libelle: marque.name },
        ]}
      />
      <div className="mt-6 mb-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <Eyebrow>
            {marque.country} · depuis {marque.foundedYear}
          </Eyebrow>
          <h1 className="mt-3 text-5xl md:text-6xl">{marque.name}</h1>
          <span aria-hidden className="mt-5 block h-px w-12 bg-cadran" />
        </div>
        <div className="space-y-4 leading-relaxed text-graphite">
          <p className="text-encre">{marque.description}</p>
          {marque.history && <p>{marque.history}</p>}
        </div>
      </div>
    </>
  );
}

async function CatalogueMarque({ params, searchParams }: PageProps<"/marques/[slug]">) {
  const { slug } = await params;
  return <VueCatalogue searchParams={searchParams} chemin={`/marques/${slug}`} marque={slug} />;
}

export default function PageMarque(props: PageProps<"/marques/[slug]">) {
  return (
    <Container className="py-10 md:py-14">
      <Suspense fallback={<div className="h-64" />}>
        <EnTeteMarque params={props.params} />
      </Suspense>
      <Suspense fallback={<CatalogueSquelette />}>
        <CatalogueMarque {...props} />
      </Suspense>
    </Container>
  );
}
