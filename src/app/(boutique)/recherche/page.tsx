import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChampRecherche } from "@/components/catalogue/champ-recherche";
import { NavigationCatalogue, ZoneResultats } from "@/components/catalogue/navigation-catalogue";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { indexCatalogue } from "@/lib/catalogue";
import { trier } from "@/lib/filtres";

export const metadata: Metadata = {
  title: "Rechercher",
  robots: { index: false },
};

// « genève » et « Geneve » doivent donner les mêmes montres.
function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

async function Resultats({ searchParams }: Pick<PageProps<"/recherche">, "searchParams">) {
  const [{ q }, index] = await Promise.all([searchParams, indexCatalogue()]);
  const requete = typeof q === "string" ? q.trim() : "";
  // Chaque mot doit se retrouver dans la marque, le modèle ou le détail (mouvement, taille, matières).
  const mots = normaliser(requete).split(/\s+/).filter(Boolean);
  const resultats = trier(
    index.filter((p) => {
      const texte = normaliser(`${p.marqueNom} ${p.nom} ${p.detail}`);
      return mots.every((mot) => texte.includes(mot));
    }),
    "selection",
  );

  return (
    <NavigationCatalogue>
      <form action="/recherche" role="search" className="mt-8 flex max-w-2xl gap-3">
        <label htmlFor="champ-recherche" className="sr-only">
          Marque, modèle ou caractéristique
        </label>
        <ChampRecherche
          id="champ-recherche"
          type="search"
          name="q"
          defaultValue={requete}
          placeholder="Seiko, automatique, 38 mm…"
          enterKeyHint="search"
          className="rounded-full border-filet-fort px-5"
        />
        <Button type="submit" taille="md" className="shrink-0">
          <Search aria-hidden className="size-4" strokeWidth={1.5} />
          Rechercher
        </Button>
      </form>

      <p aria-live="polite" className="chiffres mt-8 mb-8 text-sm text-graphite">
        {requete
          ? `${resultats.length} montre${resultats.length > 1 ? "s" : ""} pour « ${requete} »`
          : `${resultats.length} montres`}
      </p>

      <ZoneResultats>
        {resultats.length > 0 ? (
          <GrilleProduits produits={resultats} niveauTitre="h2" />
        ) : (
          <div className="max-w-xl">
            <p className="font-serif text-2xl">Aucune montre ne correspond à cette recherche.</p>
            <p className="mt-3 text-graphite">
              Essayez un nom de marque ou un mot plus court, ou parcourez tout le catalogue.
            </p>
            <Button asChild variante="secondaire" className="mt-6">
              <Link href="/montres">Voir toutes les montres</Link>
            </Button>
          </div>
        )}
      </ZoneResultats>
    </NavigationCatalogue>
  );
}

export default function PageRecherche({ searchParams }: PageProps<"/recherche">) {
  return (
    <Container className="py-10 md:py-14">
      <Breadcrumb miettes={[{ libelle: "Accueil", href: "/" }, { libelle: "Rechercher" }]} />
      <h1 className="mt-6 text-4xl md:text-5xl">Rechercher une montre</h1>
      <Suspense>
        <Resultats searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
