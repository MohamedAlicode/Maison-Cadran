"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { navigationPrincipale } from "./navigation";

/** Menu mobile en tiroir, affiché sous 1 024 px. */
export function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger
        className="grid size-11 place-items-center rounded-xs hover:bg-sable/40 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </DrawerTrigger>
      <DrawerContent titre="Menu" cote="gauche" className="max-w-sm">
        <nav aria-label="Menu principal">
          <ul className="space-y-1">
            {navigationPrincipale.map((lien) => (
              <li key={lien.href}>
                <DrawerClose asChild>
                  <Link href={lien.href} className="block py-3 font-serif text-2xl">
                    {lien.libelle}
                  </Link>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
