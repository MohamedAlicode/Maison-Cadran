import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnTeteAdmin } from "@/components/admin/en-tete";
import { FormulaireProduit } from "@/components/admin/formulaire-produit";
import { optionsCatalogue, produitPourEdition } from "@/lib/admin/catalogue";
import { exigerAdmin } from "@/lib/admin/serveur";

export const metadata = { title: "Modifier une montre" };
// Page privée rendue à la demande : pas de coquille statique à valider pour un identifiant.
export const instant = false;

async function Edition({ params }: PageProps<"/admin/produits/[id]">) {
  const { id } = await params;
  await exigerAdmin(`/admin/produits/${id}`);
  const [edition, { marques, collections }] = await Promise.all([
    produitPourEdition(id),
    optionsCatalogue(),
  ]);
  if (!edition) notFound();
  return (
    <>
      <EnTeteAdmin titre={edition.nom}>
        {edition.statut === "PUBLISHED" && (
          <Link
            href={`/montres/${edition.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cadran hover:underline"
          >
            Voir la fiche
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
          </Link>
        )}
      </EnTeteAdmin>
      <FormulaireProduit
        produit={edition.produit}
        photos={edition.photos}
        collectionsCochees={edition.collections}
        marques={marques}
        collections={collections}
      />
    </>
  );
}

export default function PageProduit(props: PageProps<"/admin/produits/[id]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-96" />}>
      <Edition {...props} />
    </Suspense>
  );
}
