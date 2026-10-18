"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { Facette, Filtres } from "@/lib/filtres";
import { FilterPanel } from "./filter-panel";

type Proprietes = {
  facettes: Facette[];
  filtres: Filtres;
  chemin: string;
  total: number;
  nombreActifs: number;
};

/** Filtres sur mobile : tiroir plein écran avec un bouton « Voir N montres ». */
export function MobileFilters({ facettes, filtres, chemin, total, nombreActifs }: Proprietes) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variante="secondaire" taille="sm" className="h-11 lg:hidden">
          <SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.5} />
          Filtrer{nombreActifs > 0 && <span className="chiffres">({nombreActifs})</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        titre="Filtrer"
        cote="gauche"
        description="Affinez la liste des montres"
        pied={
          <DrawerClose asChild>
            <Button pleineLargeur>
              Voir {total} montre{total > 1 ? "s" : ""}
            </Button>
          </DrawerClose>
        }
      >
        <FilterPanel facettes={facettes} filtres={filtres} chemin={chemin} idPrefixe="mobile" />
      </DrawerContent>
    </Drawer>
  );
}
