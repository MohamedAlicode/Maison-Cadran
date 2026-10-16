"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavoris } from "@/components/favoris/etat-favoris";
import { cn } from "@/lib/utils";
import { seDeconnecter } from "@/server/actions/compte";

const liens = [
  { href: "/compte", libelle: "Tableau de bord" },
  { href: "/compte/commandes", libelle: "Commandes" },
  { href: "/compte/adresses", libelle: "Adresses" },
  { href: "/compte/favoris", libelle: "Favoris" },
] as const;

const classeLien =
  "flex h-11 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-(--duree-courte) ease-maison hover:text-cadran";

/** Rangée qui défile sous 1024 px, colonne fixe au-dessus. Une commande ouverte garde « Commandes » actif. */
export function NavigationCompte() {
  const chemin = usePathname();
  const { oublier } = useFavoris();
  return (
    <nav aria-label="Mon compte" className="max-lg:-mx-6 max-lg:overflow-x-auto max-lg:px-6">
      <ul className="flex gap-1 lg:flex-col">
        {liens.map(({ href, libelle }) => {
          const actif = href === "/compte" ? chemin === href : chemin.startsWith(href);
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
        <li className="lg:mt-4 lg:border-t lg:border-filet lg:pt-4">
          <form
            action={async () => {
              oublier();
              await seDeconnecter();
            }}
          >
            <button type="submit" className={cn(classeLien, "gap-2 text-graphite")}>
              <LogOut aria-hidden className="size-4" strokeWidth={1.5} />
              Se déconnecter
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
