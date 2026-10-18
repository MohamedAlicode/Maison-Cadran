"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { changerStatutAvis } from "@/server/actions/admin-avis";

/** Masquer un avis le retire de la fiche ; il reste ici pour être republié. */
export function BoutonAvis({ id, masque }: { id: string; masque: boolean }) {
  const [enCours, demarrer] = useTransition();
  return (
    <Button
      variante="secondaire"
      taille="sm"
      disabled={enCours}
      onClick={() => demarrer(() => changerStatutAvis(id, masque ? "APPROVED" : "REJECTED"))}
    >
      {masque ? "Republier" : "Masquer"}
    </Button>
  );
}
