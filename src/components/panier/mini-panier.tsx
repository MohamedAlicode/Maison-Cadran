"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button, variantesBouton } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { Panier } from "@/lib/panier/serveur";
import { formatPrix } from "@/lib/prix";
import { useMiniPanier } from "./etat-mini-panier";
import { FormulaireCommander } from "./formulaire-commander";
import { LignePanier } from "./ligne-panier";
import { ProgressionLivraison, ReassurancePaiement } from "./recapitulatif";

/** Icône panier de l'en-tête, avec le nombre d'articles, qui ouvre le panier en tiroir. */
export function MiniPanier({ panier }: { panier: Panier }) {
  const { ouvert, changerOuverture, rendreFocus } = useMiniPanier();
  const nombre = panier.nombreArticles;

  return (
    <Drawer open={ouvert} onOpenChange={changerOuverture}>
      <DrawerTrigger
        className={variantesBouton({ variante: "fantome", taille: "icone" })}
        aria-label={
          nombre === 0 ? "Panier, vide" : `Panier, ${nombre} article${nombre > 1 ? "s" : ""}`
        }
      >
        <span className="relative">
          <ShoppingBag className="size-5" strokeWidth={1.5} />
          {nombre > 0 && (
            <span
              aria-hidden
              className="chiffres absolute -top-2 -right-2.5 flex size-4.5 items-center justify-center rounded-full bg-cadran text-xs leading-none text-blanc"
            >
              {nombre}
            </span>
          )}
        </span>
      </DrawerTrigger>
      <DrawerContent
        titre="Votre panier"
        onCloseAutoFocus={rendreFocus}
        pied={
          nombre > 0 && (
            <div className="space-y-4">
              <div aria-live="polite" aria-atomic className="chiffres flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatPrix(panier.sousTotalCentimes)}</span>
              </div>
              <FormulaireCommander />
              <Button asChild variante="secondaire" pleineLargeur>
                <Link href="/panier" onClick={() => changerOuverture(false)}>
                  Voir le panier
                </Link>
              </Button>
              <ReassurancePaiement />
            </div>
          )
        }
      >
        {nombre === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <p className="font-serif text-2xl">Votre panier est vide.</p>
            <Button asChild>
              <Link href="/montres" onClick={() => changerOuverture(false)}>
                Découvrir les montres
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ProgressionLivraison montants={panier} />
            <ul className="mt-8 space-y-6">
              {panier.lignes.map((ligne) => (
                <LignePanier key={ligne.id} ligne={ligne} compacte />
              ))}
            </ul>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
