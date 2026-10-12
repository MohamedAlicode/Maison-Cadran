import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/** Page introuvable, avec l'en-tête et le pied de page de la boutique. */
export default function PageIntrouvable() {
  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        <Container className="py-24 md:py-32">
          <SectionHeading
            as="h1"
            centre
            surtitre="Erreur 404"
            titre="Cette page est introuvable"
            description="Le lien est peut-être erroné, ou la page n'existe plus."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/montres">Voir les montres</Link>
            </Button>
            <Button asChild variante="secondaire">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
