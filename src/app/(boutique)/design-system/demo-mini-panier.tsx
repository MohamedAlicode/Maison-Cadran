"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Price } from "@/components/ui/price";
import { Progress } from "@/components/ui/progress";
import { boutique } from "@/config/boutique";
import { formatPrixCourt, resteAvantLivraisonOfferte } from "@/lib/prix";

// Démonstration du mini-panier en tiroir (le vrai panier arrive en phase 3).
const sousTotal = 18_900;

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
          {reste > 0 ? (
            <>
              Plus que <strong className="chiffres">{formatPrixCourt(reste)}</strong> pour la
              livraison offerte.
            </>
          ) : (
            "Votre livraison assurée est offerte."
          )}
        </p>
        <Progress
          className="mt-3"
          valeur={sousTotal}
          max={boutique.livraison.seuilGratuitCentimes}
          label="Progression vers la livraison offerte"
        />
        <div className="mt-8 flex gap-4">
          <div className="relative aspect-square w-24 shrink-0 bg-blanc">
            <Image
              src="/images/montres/orient-bambino-bleu-nuit.jpg"
              alt=""
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>
          <div className="flex-1 text-sm">
            <p className="text-xs font-medium tracking-surtitre text-graphite uppercase">Orient</p>
            <p className="font-serif text-lg">Bambino</p>
            <p className="text-graphite">Quantité : 1</p>
            <Price centimes={sousTotal} className="mt-2" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
