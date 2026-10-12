import { Heart, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ReassuranceBar } from "./reassurance-bar";
import { MobileMenu } from "./mobile-menu";
import { navigationPrincipale } from "./navigation";

const classeIcone =
  "grid size-11 place-items-center rounded-xs text-encre transition-colors hover:bg-filet/40";

/** En-tête du site : réassurance, logo centré, navigation et accès rapides. */
export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-acier/95 backdrop-blur-verre supports-[backdrop-filter]:bg-acier/85">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-encre focus:px-4 focus:py-2 focus:text-acier"
      >
        Aller au contenu
      </a>
      <ReassuranceBar compacte />
      <div className="mx-auto grid h-20 max-w-site grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-12">
        <div className="flex items-center">
          <MobileMenu />
          <Link href="/recherche" className={`${classeIcone} lg:hidden`} aria-label="Rechercher">
            <Search className="size-5" strokeWidth={1.5} />
          </Link>
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex gap-8 text-libelle font-medium tracking-surtitre uppercase">
              {navigationPrincipale.slice(0, 3).map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="transition-colors hover:text-cadran">
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-1 lg:gap-6">
          <nav aria-label="Navigation secondaire" className="hidden lg:block">
            <ul className="flex gap-8 text-libelle font-medium tracking-surtitre uppercase">
              {navigationPrincipale.slice(3).map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="transition-colors hover:text-cadran">
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center">
            <Link
              href="/recherche"
              className={`${classeIcone} hidden lg:grid`}
              aria-label="Rechercher"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/compte"
              className={`${classeIcone} hidden sm:grid`}
              aria-label="Mon compte"
            >
              <User className="size-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/compte/favoris"
              className={`${classeIcone} hidden sm:grid`}
              aria-label="Mes favoris"
            >
              <Heart className="size-5" strokeWidth={1.5} />
            </Link>
            <Link href="/panier" className={classeIcone} aria-label="Panier">
              <ShoppingBag className="size-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
      <div aria-hidden className="h-px bg-filet" />
    </header>
  );
}
