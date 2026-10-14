"use client";

import { ShoppingBag } from "lucide-react";
import { useState, useTransition, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { ajouterAuPanier } from "@/server/actions/panier";
import { useMiniPanier } from "./etat-mini-panier";

/** Bouton principal de la fiche produit. Ouvre le mini-panier une fois la montre ajoutée. */
export function AjouterAuPanier({
  produitId,
  disponible,
}: {
  produitId: string;
  disponible: boolean;
}) {
  const [enCours, demarrer] = useTransition();
  const [erreur, changerErreur] = useState<string | null>(null);
  const { ouvrirDepuis } = useMiniPanier();

  // Pendant l'ajout, le bouton reste actif (aria-disabled) : désactivé, il perdrait le focus.
  function ajouter(evenement: MouseEvent<HTMLButtonElement>) {
    if (enCours) return;
    const bouton = evenement.currentTarget;
    changerErreur(null);
    demarrer(async () => {
      const resultat = await ajouterAuPanier(produitId);
      if (resultat.ok) ouvrirDepuis(bouton);
      else changerErreur(resultat.message);
    });
  }

  return (
    <div>
      <Button
        pleineLargeur
        taille="lg"
        disabled={!disponible}
        aria-disabled={enCours}
        onClick={ajouter}
        aria-describedby="note-panier"
      >
        <ShoppingBag aria-hidden className="size-4" strokeWidth={1.5} />
        {!disponible ? "Épuisée" : enCours ? "Ajout en cours…" : "Ajouter au panier"}
      </Button>
      <p
        id="note-panier"
        role="status"
        className="mt-2 text-center text-xs text-graphite empty:hidden"
      >
        {erreur ? (
          <span className="text-bordeaux">{erreur}</span>
        ) : (
          !disponible && "Contactez-nous pour être prévenu de son retour."
        )}
      </p>
    </div>
  );
}
