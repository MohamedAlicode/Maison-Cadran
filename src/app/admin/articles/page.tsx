import { Suspense } from "react";
import { Confirmation, EnTeteAdmin } from "@/components/admin/en-tete";
import { ListeSimple } from "@/components/admin/liste-simple";
import { listeArticlesAdmin } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";
import { formatDate } from "@/lib/facture/lignes";

export const metadata = { title: "Guide" };

async function Liste({ searchParams }: PageProps<"/admin/articles">) {
  await exigerAdmin("/admin/articles");
  const [{ enregistre }, articles] = await Promise.all([searchParams, listeArticlesAdmin()]);
  return (
    <>
      <Confirmation visible={enregistre === "1"}>Article enregistré.</Confirmation>
      <ListeSimple
        vide="Aucun article pour le moment."
        lignes={articles.map((a) => ({
          href: `/admin/articles/${a.id}`,
          titre: a.title,
          detail: a.publishedAt ? `Publié le ${formatDate(a.publishedAt)}` : "Brouillon",
        }))}
      />
    </>
  );
}

export default function PageArticles(props: PageProps<"/admin/articles">) {
  return (
    <>
      <EnTeteAdmin
        titre="Guide"
        action={{ href: "/admin/articles/nouveau", libelle: "Écrire un article" }}
      >
        <p className="mt-2 max-w-xl text-graphite">
          Les articles publiés s&apos;ajoutent au bas du guide d&apos;achat, chacun sur sa page.
        </p>
      </EnTeteAdmin>
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Liste {...props} />
      </Suspense>
    </>
  );
}
