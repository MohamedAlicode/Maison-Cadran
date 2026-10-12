"use client";

import { ChevronDown } from "lucide-react";
import { optionsTri, versQueryString, type CleTri, type Filtres } from "@/lib/filtres";
import { useNavigationCatalogue } from "./navigation-catalogue";

/** Sélecteur de tri (liste native : accessible et adaptée au mobile). */
export function SortSelect({ filtres, chemin }: { filtres: Filtres; chemin: string }) {
  const { naviguer } = useNavigationCatalogue();
  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="tri" className="hidden text-graphite sm:inline">
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
          className="h-10 cursor-pointer appearance-none rounded-xs border border-sable bg-ivoire py-0 pr-9 pl-3 text-sm text-encre hover:border-sable-fonce"
        >
          {optionsTri.map((o) => (
            <option key={o.cle} value={o.cle}>
              {o.libelle}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-graphite"
        />
      </div>
    </div>
  );
}
