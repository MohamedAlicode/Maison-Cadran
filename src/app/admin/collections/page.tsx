import { Suspense } from "react";
import { Confirmation, EnTeteAdmin } from "@/components/admin/en-tete";
import { ListeSimple } from "@/components/admin/liste-simple";
import { listeCollectionsAdmin } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";

export const metadata = { title: "Collections" };

async function Liste({ searchParams }: PageProps<"/admin/collections">) {
  await exigerAdmin("/admin/collections");
  const [{ enregistre }, fiches] = await Promise.all([searchParams, listeCollectionsAdmin()]);
  return (
    <>
      <Confirmation visible={enregistre === "1"}>Collection enregistrée.</Confirmation>
      <ListeSimple
        vide="Aucune collection."
        lignes={fiches.map((m) => ({
          href: `/admin/collections/${m.id}`,
          titre: m.name,
          detail: `${m._count.products} montre${m._count.products > 1 ? "s" : ""}`,
        }))}
      />
    </>
  );
}

export default function PageCollections(props: PageProps<"/admin/collections">) {
  return (
    <>
      <EnTeteAdmin
        titre="Collections"
        action={{ href: "/admin/collections/nouvelle", libelle: "Ajouter une collection" }}
      />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Liste {...props} />
      </Suspense>
    </>
  );
}
