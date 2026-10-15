import { Heart, Search, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BoutonPanier } from "@/components/panier/bouton-panier";
import { variantesBouton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReassuranceBar } from "./reassurance-bar";
import { LienNavigation } from "./lien-navigation";
import { MobileMenu } from "./mobile-menu";
import { navigationPrincipale } from "./navigation";

const classeIcone = variantesBouton({ variante: "fantome", taille: "icone" });

/**
 * En-tête du site : réassurance, logo centré, navigation et accès rapides.
 * Le bandeau de réassurance défile avec la page ; seule la barre du logo reste collée,
 * pour ne garder que 80 px d'en-tête sur mobile.
 */
export function Header() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-encre focus:px-4 focus:py-2 focus:text-acier"
      >
        Aller au contenu
      </a>
      <ReassuranceBar compacte />
      <header className="sticky top-0 z-30 bg-acier/95 backdrop-blur-verre supports-[backdrop-filter]:bg-acier/85 transparence-reduite:bg-acier">
        <div className="mx-auto grid h-20 max-w-site grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-12">
          <div className="flex items-center">
            <MobileMenu />
            <Link
              href="/recherche"
              className={cn(classeIcone, "xl:hidden")}
              aria-label="Rechercher"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </Link>
            <nav aria-label="Navigation principale" className="hidden xl:block">
              <ul className="flex gap-8 text-sm font-medium">
                {navigationPrincipale.slice(0, 3).map((lien) => (
                  <li key={lien.href}>
                    <LienNavigation href={lien.href} className="inline-block py-3">
                      {lien.libelle}
                    </LienNavigation>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-1 xl:gap-6">
            <nav aria-label="Navigation secondaire" className="hidden xl:block">
              <ul className="flex gap-8 text-sm font-medium">
                {navigationPrincipale.slice(3).map((lien) => (
                  <li key={lien.href}>
                    <LienNavigation href={lien.href} className="inline-block py-3">
                      {lien.libelle}
                    </LienNavigation>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center">
              <Link
                href="/recherche"
                className={cn(classeIcone, "hidden xl:inline-flex")}
                aria-label="Rechercher"
              >
                <Search className="size-5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/compte"
                className={cn(classeIcone, "hidden sm:inline-flex")}
                aria-label="Mon compte"
              >
                <User className="size-5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/compte/favoris"
                className={cn(classeIcone, "hidden sm:inline-flex")}
                aria-label="Mes favoris"
              >
                <Heart className="size-5" strokeWidth={1.5} />
              </Link>
              <BoutonPanier />
            </div>
          </div>
        </div>
        <div aria-hidden className="h-px bg-filet" />
      </header>
    </>
  );
}
