"use client";

import { useRef, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { useNavigationCatalogue } from "./navigation-catalogue";

// Les résultats suivent la frappe après une courte pause, pour ne pas lancer une recherche par lettre.
const PAUSE_MS = 250;

/** Champ de la page Rechercher : met les résultats à jour pendant la saisie, sans attendre Entrée. */
export function ChampRecherche(props: ComponentProps<typeof Input>) {
  const { naviguer } = useNavigationCatalogue();
  const minuteur = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <Input
      {...props}
      onChange={(evenement) => {
        const requete = evenement.target.value.trim();
        clearTimeout(minuteur.current);
        minuteur.current = setTimeout(() => {
          // replace : chaque lettre tapée ne doit pas ajouter une page à l'historique du navigateur.
          naviguer(requete ? `/recherche?q=${encodeURIComponent(requete)}` : "/recherche", {
            remplacer: true,
          });
        }, PAUSE_MS);
      }}
    />
  );
}
