"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavoris } from "./etat-favoris";

type Proprietes = {
  produitId: string;
  /** Marque et modèle, pour que le lecteur d'écran sache quelle montre il garde. */
  nom: string;
  /** Pastille ronde posée sur la photo d'une carte, ou bouton texte sous « Ajouter au panier ». */
  variante?: "carte" | "fiche";
  className?: string;
};

export function BoutonFavori({ produitId, nom, variante = "carte", className }: Proprietes) {
  const { estFavori, basculer } = useFavoris();
  const favori = estFavori(produitId);
  const coeur = (
    <Heart
      aria-hidden
      className={cn("size-5", favori && "fill-cadran text-cadran")}
      strokeWidth={1.5}
    />
  );

  if (variante === "fiche") {
    return (
      <Button
        variante="fantome"
        pleineLargeur
        aria-pressed={favori}
        onClick={() => basculer(produitId)}
        className={className}
      >
        {coeur}
        {favori ? "Dans vos favoris" : "Ajouter aux favoris"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Favori : ${nom}`}
      aria-pressed={favori}
      onClick={() => basculer(produitId)}
      className={cn(
        "grid size-11 place-items-center rounded-full text-encre",
        "bg-acier/90 backdrop-blur-verre transparence-reduite:bg-acier",
        "transition-colors duration-(--duree-courte) ease-maison hover:text-cadran",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cadran",
        className,
      )}
    >
      {coeur}
    </button>
  );
}
