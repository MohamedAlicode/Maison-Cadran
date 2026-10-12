import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/** Montre inconnue ou retirée du catalogue. */
export default function MontreIntrouvable() {
  return (
    <Container className="py-24 md:py-32">
      <SectionHeading
        as="h1"
        centre
        surtitre="Erreur 404"
        titre="Cette montre n'est plus disponible"
        description="Elle a peut-être été retirée de notre sélection. Découvrez les autres modèles du catalogue."
      />
      <div className="mt-10 flex justify-center">
        <Button asChild>
          <Link href="/montres">Voir toutes les montres</Link>
        </Button>
      </div>
    </Container>
  );
}
