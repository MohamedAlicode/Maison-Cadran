"use client";

import { WatchPlaceholder } from "@/components/brand/watch-placeholder";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Price } from "@/components/ui/price";
import { Progress } from "@/components/ui/progress";
import { boutique } from "@/config/boutique";
import { formatPrixCourt, resteAvantLivraisonOfferte } from "@/lib/prix";

// Démonstration du mini-panier en tiroir (le vrai panier arrive en phase 3).
const sousTotal = 11_800;

export function DemoMiniPanier() {
  const reste = resteAvantLivraisonOfferte(sousTotal);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variante="secondaire">Ouvrir le mini-panier</Button>
      </DrawerTrigger>
      <DrawerContent
        titre="Votre panier"
        pied={
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <Price centimes={sousTotal} />
            </div>
            <Button pleineLargeur>Commander</Button>
          </div>
        }
      >
        <p className="text-sm">
          Plus que <strong className="chiffres">{formatPrixCourt(reste)}</strong> pour la livraison
          offerte.
        </p>
        <Progress
          className="mt-3"
          valeur={sousTotal}
          max={boutique.livraison.seuilGratuitCentimes}
          label="Progression vers la livraison offerte"
        />
        <div className="mt-8 flex gap-4">
          <div className="w-24 shrink-0 bg-blanc p-3">
            <WatchPlaceholder cadran="#f2efe8" boitier="#c8c4bc" bracelet="#2a2d33" />
          </div>
          <div className="flex-1 text-sm">
            <p className="text-[11px] font-medium tracking-surtitre text-graphite uppercase">
              Orient
            </p>
            <p className="font-serif text-lg">Bambino Version 2</p>
            <p className="text-graphite">Quantité : 1</p>
            <Price centimes={sousTotal} className="mt-2" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
