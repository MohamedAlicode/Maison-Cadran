import Image from "next/image";
import Link from "next/link";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { ReassuranceBar } from "@/components/layout/reassurance-bar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import {
  indexCatalogue,
  listeCollections,
  listeMarques,
  produitsPlusApprecies,
} from "@/lib/catalogue";
import { trier } from "@/lib/filtres";

// Page d'accueil : hero, nouveautés, collections, montres les plus appréciées, marques, réassurance.
export default async function Accueil() {
  const [index, appreciees, collections, marques] = await Promise.all([
    indexCatalogue(),
    produitsPlusApprecies(),
    listeCollections(),
    listeMarques(),
  ]);
  const nouveautes = trier(
    index.filter((p) => p.stock > 0),
    "nouveautes",
  ).slice(0, 4);

  return (
    <>
      {/* Hero sombre */}
      <section className="bg-nuit text-acier">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 lg:py-32">
          <div className="animate-fondu">
            <Eyebrow className="text-cadran-clair">Nouvelle sélection automne</Eyebrow>
            <h1 className="mt-5 text-5xl leading-affiche md:text-6xl lg:text-7xl">
              Le temps,
              <br />
              <em className="font-normal text-cadran-clair">bien choisi.</em>
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-acier/75">
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
                className="border-acier/40 text-acier hover:bg-acier hover:text-encre"
              >
                <Link href="/marques">Nos marques</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full bg-blanc md:max-w-md">
            <Image
              src="/images/montres/hero.svg"
              alt="Montre à cadran bleu"
              fill
              priority
              sizes="(min-width: 768px) 28rem, 24rem"
              className="object-contain p-(--marge-photo-large)"
            />
          </div>
        </Container>
      </section>

      {/* Nouveautés */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading surtitre="Nouveautés" titre="Arrivées récentes" />
            <TextLink href="/montres?tri=nouveautes" className="text-sm font-medium">
              Voir toutes les nouveautés
            </TextLink>
          </div>
          <GrilleProduits produits={nouveautes} />
        </Container>
      </section>

      {/* Collections */}
      <section className="border-y border-filet bg-blanc py-20 md:py-28">
        <Container>
          <SectionHeading surtitre="Collections" titre="Par envie" className="mb-12" />
          <ul className="grid gap-px bg-filet md:grid-cols-3">
            {collections.map((c) => (
              <li key={c.id} className="bg-blanc">
                <Link
                  href={`/collections/${c.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-acier"
                >
                  <h3 className="text-3xl transition-colors group-hover:text-cadran">{c.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite">
                    {c.description}
                  </p>
                  <span className="mt-8 text-libelle font-medium tracking-surtitre uppercase">
                    Découvrir{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Les plus appréciées */}
      {appreciees.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <SectionHeading
              surtitre="Avis clients"
              titre="Les plus appréciées"
              description="Les montres les mieux notées par nos clients."
              className="mb-12"
            />
            <GrilleProduits produits={appreciees} />
          </Container>
        </section>
      )}

      {/* Marques */}
      <section className="border-y border-filet bg-blanc py-16">
        <Container>
          <Eyebrow className="text-center">Les maisons que nous sélectionnons</Eyebrow>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-serif text-2xl text-graphite md:gap-x-14">
            {marques.map((marque) => (
              <li key={marque.id}>
                <Link
                  href={`/marques/${marque.slug}`}
                  className="transition-colors hover:text-encre"
                >
                  {marque.name}
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
