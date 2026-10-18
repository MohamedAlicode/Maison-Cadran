import { Suspense } from "react";
import { Confirmation, EnTeteAdmin } from "@/components/admin/en-tete";
import { ListeSimple } from "@/components/admin/liste-simple";
import { listeMarquesAdmin } from "@/lib/admin/fiches";
import { exigerAdmin } from "@/lib/admin/serveur";

export const metadata = { title: "Marques" };

async function Liste({ searchParams }: PageProps<"/admin/marques">) {
  await exigerAdmin("/admin/marques");
  const [{ enregistre }, fiches] = await Promise.all([searchParams, listeMarquesAdmin()]);
  return (
    <>
      <Confirmation visible={enregistre === "1"}>Marque enregistrée.</Confirmation>
      <ListeSimple
        vide="Aucune marque."
        lignes={fiches.map((m) => ({
          href: `/admin/marques/${m.id}`,
          titre: m.name,
          detail: `${m._count.products} montre${m._count.products > 1 ? "s" : ""}`,
        }))}
      />
    </>
  );
}

export default function PageMarques(props: PageProps<"/admin/marques">) {
  return (
    <>
      <EnTeteAdmin
        titre="Marques"
        action={{ href: "/admin/marques/nouvelle", libelle: "Ajouter une marque" }}
      />
      <Suspense fallback={<div aria-hidden className="h-64" />}>
        <Liste {...props} />
      </Suspense>
    </>
  );
}
