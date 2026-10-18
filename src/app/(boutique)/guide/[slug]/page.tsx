import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageEditoriale } from "@/components/editorial/page-editoriale";
import { sectionsArticle, TexteArticle } from "@/components/editorial/texte-article";
import { Container } from "@/components/ui/container";
import { articleParSlug } from "@/lib/articles/lecture";
import { lireArticle } from "@/lib/articles/texte";

// Pas de generateStaticParams : il exige au moins un article publié pour que le site se
// construise. La page est donc rendue à la demande, ses lectures restant en cache.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleParSlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    alternates: { canonical: `/guide/${article.slug}` },
  };
}

async function Article({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const article = await articleParSlug(slug);
  if (!article) notFound();
  const contenu = sectionsArticle(lireArticle(article.content));

  return (
    <PageEditoriale
      titre={article.title}
      parent={{ libelle: "Guide d'achat", href: "/guide" }}
      introduction={<p>{article.excerpt}</p>}
      rubriques={contenu.sections}
    >
      {article.coverUrl && (
        <div className="relative mb-14 aspect-[3/2] overflow-hidden rounded-cadre bg-acier">
          <Image
            src={article.coverUrl}
            alt={article.coverAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 65ch, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      <TexteArticle {...contenu} />
    </PageEditoriale>
  );
}

export default function PageArticle(props: PageProps<"/guide/[slug]">) {
  return (
    <Suspense fallback={<Container className="h-screen" />}>
      <Article {...props} />
    </Suspense>
  );
}
