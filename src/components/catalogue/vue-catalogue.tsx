import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { indexCatalogue } from "@/lib/catalogue";
import {
  lireFiltres,
  nombreFiltresActifs,
  rechercher,
  versQueryString,
  type CleFiltre,
  type Filtres,
} from "@/lib/filtres";
import { cn } from "@/lib/utils";
import { FilterPanel } from "./filter-panel";
import { MobileFilters } from "./mobile-filters";
import { NavigationCatalogue, ZoneResultats } from "./navigation-catalogue";
import { GrilleProduits } from "./product-card";
import { SortSelect } from "./sort-select";

type Proprietes = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  /** Chemin de la page, pour construire les liens de filtres. */
  chemin: string;
  /** Restreint le catalogue à une marque (page marque). */
  marque?: string;
  /** Restreint le catalogue à une liste de produits (page collection). */
  slugs?: string[];
};

/**
 * Catalogue filtrable : barre d'outils, filtres (colonne sur desktop, tiroir sur mobile),
 * filtres actifs en puces et grille de résultats. Lit les paramètres d'URL : à placer dans <Suspense>.
 */
export async function VueCatalogue({ searchParams, chemin, marque, slugs }: Proprietes) {
  const filtres = lireFiltres(await searchParams);
  let index = await indexCatalogue();
  if (marque) index = index.filter((p) => p.marqueSlug === marque);
  if (slugs) index = index.filter((p) => slugs.includes(p.slug));

  const { total, page, pages, produits, facettes } = rechercher(index, filtres);
  // Sur une page marque, le filtre « marque » n'a pas de sens.
  const facettesUtiles = facettes.filter((f) => !(marque && f.cle === "marque"));
  const actifs = nombreFiltresActifs(filtres);

  return (
    <NavigationCatalogue>
      <div className="flex items-center justify-between gap-4 border-y border-sable py-3">
        <div className="flex items-center gap-4">
          <MobileFilters
            facettes={facettesUtiles}
            filtres={filtres}
            chemin={chemin}
            total={total}
            nombreActifs={actifs}
          />
          <p className="chiffres text-sm text-graphite" aria-live="polite">
            {total} montre{total > 1 ? "s" : ""}
          </p>
        </div>
        <SortSelect filtres={filtres} chemin={chemin} />
      </div>

      <PucesFiltres facettes={facettesUtiles} filtres={filtres} chemin={chemin} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr] xl:gap-14">
        <aside aria-label="Filtres" className="hidden lg:block">
          <div className="sticky top-36">
            <FilterPanel
              facettes={facettesUtiles}
              filtres={filtres}
              chemin={chemin}
              idPrefixe="desktop"
            />
          </div>
        </aside>

        <ZoneResultats>
          {produits.length > 0 ? (
            <GrilleProduits produits={produits} colonnes={3} niveauTitre="h2" />
          ) : (
            <div className="border border-sable bg-ivoire px-6 py-16 text-center">
              <p className="font-serif text-2xl">Aucune montre ne correspond à ces critères</p>
              <p className="mt-3 text-graphite">Retirez un filtre pour élargir votre recherche.</p>
              <Button asChild variante="secondaire" className="mt-8">
                <Link href={chemin}>Effacer les filtres</Link>
              </Button>
            </div>
          )}
          {pages > 1 && <Pagination filtres={filtres} chemin={chemin} page={page} pages={pages} />}
        </ZoneResultats>
      </div>
    </NavigationCatalogue>
  );
}

/** Filtres actifs sous forme de puces supprimables (simples liens : fonctionnent sans JavaScript). */
function PucesFiltres({
  facettes,
  filtres,
  chemin,
}: {
  facettes: { cle: CleFiltre; options: { valeur: string; libelle: string; actif: boolean }[] }[];
  filtres: Filtres;
  chemin: string;
}) {
  const puces = facettes.flatMap((f) =>
    f.options
      .filter((o) => o.actif)
      .map((o) => ({
        cle: f.cle,
        libelle: o.libelle,
        href:
          chemin +
          versQueryString({
            ...filtres,
            [f.cle]: filtres[f.cle].filter((v) => v !== o.valeur),
            page: 1,
          }),
      })),
  );
  if (puces.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filtres actifs">
      {puces.map((p) => (
        <li key={`${p.cle}-${p.libelle}`}>
          <Link
            href={p.href}
            scroll={false}
            className="inline-flex h-8 items-center gap-2 rounded-xs border border-sable bg-ivoire px-3 text-xs text-encre transition-colors hover:border-encre"
          >
            {p.libelle}
            <X aria-hidden className="size-3.5 text-graphite" />
            <span className="sr-only">(retirer ce filtre)</span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={chemin + versQueryString({ tri: filtres.tri })}
          scroll={false}
          className="ml-2 text-xs text-laiton-fonce underline underline-offset-4"
        >
          Tout effacer
        </Link>
      </li>
    </ul>
  );
}

function Pagination({
  filtres,
  chemin,
  page,
  pages,
}: {
  filtres: Filtres;
  chemin: string;
  page: number;
  pages: number;
}) {
  return (
    <nav aria-label="Pagination" className="mt-16 flex justify-center gap-2">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={chemin + versQueryString({ ...filtres, page: n })}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "chiffres grid size-10 place-items-center rounded-xs border text-sm",
            n === page ? "border-encre bg-encre text-creme" : "border-sable hover:border-encre",
          )}
        >
          {n}
        </Link>
      ))}
    </nav>
  );
}

/** Squelette affiché pendant le chargement du catalogue. */
export function CatalogueSquelette() {
  return (
    <div aria-hidden>
      <div className="h-[66px] border-y border-sable" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr] xl:gap-14">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-12 border-b border-sable" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <div className="aspect-square animate-pulse bg-ivoire" />
              <div className="mt-4 h-3 w-16 bg-sable/60" />
              <div className="mt-2 h-5 w-3/4 bg-sable/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
