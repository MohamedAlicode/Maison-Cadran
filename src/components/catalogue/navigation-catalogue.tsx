"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Contexte partagé par les filtres, le tri et la grille : la navigation se fait dans une
// transition React, ce qui permet d'atténuer la grille pendant le chargement des résultats.
type ContexteNavigation = { naviguer: (url: string) => void; enCours: boolean };

const Contexte = createContext<ContexteNavigation | null>(null);

export function useNavigationCatalogue() {
  const contexte = use(Contexte);
  if (!contexte)
    throw new Error("useNavigationCatalogue doit être utilisé dans <NavigationCatalogue>");
  return contexte;
}

export function NavigationCatalogue({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const naviguer = (url: string) => demarrer(() => router.push(url, { scroll: false }));
  return <Contexte value={{ naviguer, enCours }}>{children}</Contexte>;
}

/** Zone des résultats, atténuée pendant le chargement d'une nouvelle recherche. */
export function ZoneResultats({ children }: { children: ReactNode }) {
  const { enCours } = useNavigationCatalogue();
  return (
    <div
      aria-busy={enCours}
      className={cn("transition-opacity duration-200", enCours && "pointer-events-none opacity-50")}
    >
      {children}
    </div>
  );
}
