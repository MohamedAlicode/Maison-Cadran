import Link from "next/link";
import { WatchPlaceholder } from "@/components/brand/watch-placeholder";
import { ProductCard } from "@/components/catalogue/product-card";
import { ReassuranceBar } from "@/components/layout/reassurance-bar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { produitsDemo } from "@/lib/demo";

// Page d'accueil, version phase 1 : sert de vitrine au design system.
// Les sections seront branchées sur la base de données en phase 2.

const marques = [
  "Tissot",
  "Hamilton",
  "Seiko",
  "Citizen",
  "Orient",
  "Certina",
  "Mido",
  "Frederique Constant",
];

export default function Accueil() {
  return (
    <>
      {/* Hero sombre */}
      <section className="bg-nuit text-creme">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 lg:py-32">
          <div className="animate-fondu">
            <Eyebrow className="text-laiton-clair">Nouvelle sélection automne</Eyebrow>
            <h1 className="mt-5 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              Le temps,
              <br />
              <em className="font-normal text-laiton-clair">bien choisi.</em>
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-creme/75">
              Des montres de caractère, de 100 à 2 000 €, sélectionnées pièce par pièce.
              Authenticité garantie, livraison assurée, retours gratuits sous 14 jours.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variante="clair" taille="lg">
                <Link href="/montres">Découvrir les montres</Link>
              </Button>
              <Button
                asChild
                variante="secondaire"
                taille="lg"
                className="border-creme/40 text-creme hover:bg-creme hover:text-encre"
              >
                <Link href="/guide">Guide d&apos;achat</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm md:max-w-md">
            <WatchPlaceholder
              cadran="#1f3a5f"
              boitier="#d8d3ca"
              bracelet="#2a2d33"
              label="Montre à cadran bleu"
            />
          </div>
        </Container>
      </section>

      {/* Nouveautés */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading surtitre="Nouveautés" titre="Arrivées récentes" />
            <TextLink href="/montres?tri=nouveautes" className="text-sm font-medium">
              Voir toutes les nouveautés
            </TextLink>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {produitsDemo.map((produit) => (
              <ProductCard
                key={produit.slug}
                produit={produit}
                visuel={
                  <WatchPlaceholder
                    {...produit.couleurs}
                    label={`${produit.marque} ${produit.nom}`}
                  />
                }
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Marques */}
      <section className="border-y border-sable bg-ivoire py-16">
        <Container>
          <Eyebrow className="text-center">Les maisons que nous sélectionnons</Eyebrow>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-serif text-2xl text-graphite md:gap-x-14">
            {marques.map((marque) => (
              <li key={marque}>
                <Link href="/marques" className="transition-colors hover:text-encre">
                  {marque}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Réassurance */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            centre
            surtitre="Nos engagements"
            titre="Acheter sereinement"
            description="Une belle montre est un achat qui compte. Chaque commande est vérifiée, assurée et accompagnée."
          />
          <ReassuranceBar className="mt-16" />
        </Container>
      </section>
    </>
  );
}
