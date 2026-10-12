"use client";

import { Heart, Menu, User } from "lucide-react";
import Link from "next/link";
import { variantesBouton } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { LienNavigation } from "./lien-navigation";
import { navigationPrincipale } from "./navigation";

const liensCompte = [
  { libelle: "Mon compte", href: "/compte", icone: User },
  { libelle: "Mes favoris", href: "/compte/favoris", icone: Heart },
] as const;

/** Menu en tiroir, affiché sous 1 280 px : en dessous, les cinq liens et les quatre icônes ne tiennent pas autour du logo. */
export function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger
        className={cn(variantesBouton({ variante: "fantome", taille: "icone" }), "xl:hidden")}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </DrawerTrigger>
      <DrawerContent
        titre="Menu"
        cote="gauche"
        className="max-w-sm"
        pied={
          // Compte et favoris n'ont pas de place dans l'en-tête sous 640 px : ils sont repris ici.
          <ul className="space-y-4 text-sm">
            {liensCompte.map(({ libelle, href, icone: Icone }) => (
              <li key={href}>
                <DrawerClose asChild>
                  <Link href={href} className="inline-flex items-center gap-3 hover:text-cadran">
                    <Icone aria-hidden className="size-5" strokeWidth={1.5} />
                    {libelle}
                  </Link>
                </DrawerClose>
              </li>
            ))}
          </ul>
        }
      >
        <nav aria-label="Menu principal">
          <ul className="space-y-1">
            {navigationPrincipale.map((lien) => (
              <li key={lien.href}>
                <DrawerClose asChild>
                  <LienNavigation href={lien.href} className="block py-3 font-serif text-2xl">
                    {lien.libelle}
                  </LienNavigation>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
