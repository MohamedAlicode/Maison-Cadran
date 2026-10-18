"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const liens = [
  { href: "/admin", libelle: "Tableau de bord" },
  { href: "/admin/commandes", libelle: "Commandes" },
  { href: "/admin/produits", libelle: "Produits" },
  { href: "/admin/marques", libelle: "Marques" },
  { href: "/admin/collections", libelle: "Collections" },
  { href: "/admin/codes-promo", libelle: "Codes promo" },
  { href: "/admin/avis", libelle: "Avis" },
  { href: "/admin/articles", libelle: "Guide" },
] as const;

const classeLien =
  "flex h-11 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-(--duree-courte) ease-maison hover:text-cadran";

/** Même gabarit que la navigation de l'espace client : rangée défilante sous 1024 px, colonne au-dessus. */
export function NavigationAdmin() {
  const chemin = usePathname();
  return (
    <nav aria-label="Back-office" className="max-lg:-mx-6 max-lg:overflow-x-auto max-lg:px-6">
      <ul className="flex gap-1 lg:flex-col">
        {liens.map(({ href, libelle }) => {
          const actif = href === "/admin" ? chemin === href : chemin.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={actif ? "page" : undefined}
                className={cn(classeLien, actif && "bg-blanc text-cadran")}
              >
                {libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
