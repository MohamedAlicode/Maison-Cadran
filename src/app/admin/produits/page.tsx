import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChampSelect } from "@/components/admin/champs";
import { Confirmation, EnTeteAdmin } from "@/components/admin/en-tete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TextLink } from "@/components/ui/text-link";
import { ProductStatus } from "@/generated/prisma/enums";
import { listeProduitsAdmin } from "@/lib/admin/catalogue";
import { exigerAdmin } from "@/lib/admin/serveur";
import { libellesStatutProduit } from "@/lib/libelles";
import { formatPrix } from "@/lib/prix";

export const metadata = { title: "Produits" };

const variantesStatut = { PUBLISHED: "succes", DRAFT: "neutre", ARCHIVED: "neutre" } as const;

async function ListeProduits({ searchParams }: PageProps<"/admin/produits">) {
  await exigerAdmin("/admin/produits");
  const { statut, stock, q, enregistre } = await searchParams;
  const statutChoisi = Object.values(ProductStatus).find((s) => s === statut);
  const recherche = typeof q === "string" ? q.trim() : "";
  const produits = await listeProduitsAdmin({
    statut: statutChoisi,
    stockBas: stock === "bas",
    recherche,
  });

  return (
    <>
      <Confirmation visible={enregistre === "1"}>Produit enregistré.</Confirmation>
      <form className="mb-6 grid gap-4 rounded-cadre bg-blanc p-6 md:grid-cols-[1fr_12rem_auto] md:items-end">
        <Field
          id="recherche"
          name="q"
          type="search"
          label="Rechercher"
          defaultValue={recherche}
          placeholder="Modèle, marque ou référence"
        />
        <ChampSelect
          id="statut"
          name="statut"
          label="Statut"
          defaultValue={statutChoisi ?? ""}
          options={[
            { valeur: "", libelle: "Tous" },
            ...Object.entries(libellesStatutProduit).map(([valeur, libelle]) => ({
              valeur,
              libelle,
            })),
          ]}
        />
        {stock === "bas" && <input type="hidden" name="stock" value="bas" />}
        <Button type="submit" variante="secondaire">
          Filtrer
        </Button>
      </form>
      {stock === "bas" && (
        <p className="mb-4 text-sm">
          Stocks bas seulement. <TextLink href="/admin/produits">Voir tous les produits</TextLink>
        </p>
      )}
      {produits.length ? (
        <ul className="divide-y divide-filet rounded-cadre bg-blanc">
          {produits.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/produits/${p.id}`}
                className="grid grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-1 p-4 hover:text-cadran md:grid-cols-[3.5rem_1fr_8rem_6rem_7rem] md:px-6"
              >
                <span className="relative row-span-2 size-14 overflow-hidden rounded-controle bg-acier md:row-span-1">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {p.brand.name} {p.name}
                  </span>
                  <span className="chiffres block truncate text-sm text-graphite">
                    {p.reference}
                  </span>
                </span>
                <span className="chiffres text-sm max-md:col-start-2 md:text-right">
                  {formatPrix(p.priceCents)}
                </span>
                <span
                  className={`chiffres text-sm max-md:col-start-2 md:text-right ${p.stock <= p.lowStockThreshold ? "text-ambre" : "text-graphite"}`}
                >
                  {p.stock} en stock
                </span>
                <span className="max-md:col-start-2 md:justify-self-end">
                  <Badge variante={variantesStatut[p.status]}>
                    {libellesStatutProduit[p.status]}
                  </Badge>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-cadre bg-blanc p-6 text-sm text-graphite">
          Aucun produit ne correspond.
        </p>
      )}
    </>
  );
}

export default function PageProduits(props: PageProps<"/admin/produits">) {
  return (
    <>
      <EnTeteAdmin
        titre="Produits"
        action={{ href: "/admin/produits/nouveau", libelle: "Ajouter une montre" }}
      />
      <Suspense fallback={<div aria-hidden className="h-96" />}>
        <ListeProduits {...props} />
      </Suspense>
    </>
  );
}
