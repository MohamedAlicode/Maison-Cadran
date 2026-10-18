import type { Metadata } from "next";
import { NavigationCompte } from "@/components/compte/navigation-compte";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

/**
 * La navigation est statique : la session n'est lue que dans chaque page, sous un <Suspense>,
 * pour que le cadre s'affiche sans attendre la base.
 */
export default function LayoutCompte({ children }: { children: React.ReactNode }) {
  return (
    <Container className="grid grid-cols-1 gap-8 py-10 md:py-16 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <NavigationCompte />
      </aside>
      <div className="min-w-0">{children}</div>
    </Container>
  );
}
