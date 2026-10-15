"use client";

import { ChevronDown } from "lucide-react";
import { optionsTri, versQueryString, type CleTri, type Filtres } from "@/lib/filtres";
import { useNavigationCatalogue } from "./navigation-catalogue";

/** Sélecteur de tri (liste native : accessible et adaptée au mobile). */
export function SortSelect({ filtres, chemin }: { filtres: Filtres; chemin: string }) {
  const { naviguer } = useNavigationCatalogue();
  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="tri" className="sr-only text-graphite sm:not-sr-only">
        Trier par
      </label>
      <div className="relative">
        <select
          id="tri"
          value={filtres.tri}
          onChange={(e) =>
            naviguer(
              chemin + versQueryString({ ...filtres, tri: e.target.value as CleTri, page: 1 }),
            )
          }
          className="h-11 cursor-pointer appearance-none rounded-full border border-filet-fort bg-blanc py-0 pr-10 pl-4 text-sm text-encre hover:border-filet-fort"
        >
          {optionsTri.map((o) => (
            <option key={o.cle} value={o.cle}>
              {o.libelle}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-graphite"
        />
      </div>
    </div>
  );
}
