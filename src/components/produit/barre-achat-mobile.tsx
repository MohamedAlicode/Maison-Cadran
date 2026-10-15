"use client";

import { useEffect, useState } from "react";
import { AjouterAuPanier } from "@/components/panier/ajouter-au-panier";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";

/**
 * Barre d'achat collée en bas de l'écran sous 1 024 px, en verre utile au-dessus des photos.
 * Elle n'apparaît que lorsque le bouton principal (repéré par `idCible`) et le pied de page
 * sont hors de l'écran : jamais deux boutons d'achat visibles en même temps.
 */
export function BarreAchatMobile({
  idCible,
  produitId,
  disponible,
  marque,
  nom,
  prixCentimes,
}: {
  idCible: string;
  produitId: string;
  disponible: boolean;
  marque: string;
  nom: string;
  prixCentimes: number;
}) {
  const [visible, changerVisible] = useState(false);

  useEffect(() => {
    const cibles = [document.getElementById(idCible), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const aLEcran = new Map<Element, boolean>();
    const observateur = new IntersectionObserver((entrees) => {
      for (const e of entrees) aLEcran.set(e.target, e.isIntersecting);
      changerVisible(![...aLEcran.values()].some(Boolean));
    });
    for (const el of cibles) observateur.observe(el);
    return () => observateur.disconnect();
  }, [idCible]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 border-t border-filet bg-acier/90 px-6 pt-3 pb-[max(--spacing(3),env(safe-area-inset-bottom))] backdrop-blur-verre transition-[translate,visibility] duration-(--duree-moyenne) ease-maison lg:hidden transparence-reduite:bg-acier",
        // Masquée, elle sort aussi de l'ordre de tabulation et de l'arbre d'accessibilité.
        visible ? "visible translate-y-0" : "invisible translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-serif text-lg leading-snug">
            <span className="text-graphite">{marque}</span> {nom}
          </p>
          <Price centimes={prixCentimes} className="text-sm" />
        </div>
        <AjouterAuPanier produitId={produitId} disponible={disponible} compact />
      </div>
    </div>
  );
}
