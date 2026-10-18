import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NavigationAdmin } from "@/components/admin/navigation-admin";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office" },
  robots: { index: false },
};

/**
 * Cadre du back-office, sans en-tête de boutique : la session et le rôle sont vérifiés dans
 * chaque page, sous un <Suspense>, pour que ce cadre s'affiche sans attendre la base.
 */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-encre focus:px-4 focus:py-2 focus:text-acier"
      >
        Aller au contenu
      </a>
      <header className="border-b border-filet bg-blanc">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <Logo />
            <span className="text-xs font-medium tracking-surtitre text-graphite uppercase">
              Back-office
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium hover:text-cadran"
          >
            Voir la boutique
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
          </Link>
        </Container>
      </header>
      <main id="contenu" className="flex-1">
        <Container className="grid grid-cols-1 gap-8 py-10 md:py-12 lg:grid-cols-[13rem_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <NavigationAdmin />
          </aside>
          <div className="min-w-0">{children}</div>
        </Container>
      </main>
    </>
  );
}
