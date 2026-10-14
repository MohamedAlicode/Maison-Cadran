import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogueSquelette, VueCatalogue } from "@/components/catalogue/vue-catalogue";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { collectionParSlug, listeCollections } from "@/lib/catalogue";

export async function generateStaticParams() {
  const collections = await listeCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await collectionParSlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description ?? undefined,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

async function ContenuCollection({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await collectionParSlug(slug);
  if (!collection) notFound();
  return (
    <>
      <Breadcrumb
        miettes={[
          { libelle: "Accueil", href: "/" },
          { libelle: "Montres", href: "/montres" },
          { libelle: collection.name },
        ]}
      />
      <div className="mt-6 mb-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl">{collection.name}</h1>
        {collection.description && (
          <p className="mt-4 leading-relaxed text-graphite">{collection.description}</p>
        )}
      </div>
      <VueCatalogue
        searchParams={searchParams}
        chemin={`/collections/${collection.slug}`}
        slugs={collection.slugsProduits}
      />
    </>
  );
}

export default function PageCollection(props: PageProps<"/collections/[slug]">) {
  return (
    <Container className="py-10 md:py-14">
      <Suspense fallback={<CatalogueSquelette />}>
        <ContenuCollection {...props} />
      </Suspense>
    </Container>
  );
}
