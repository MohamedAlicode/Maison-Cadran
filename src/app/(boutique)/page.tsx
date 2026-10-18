import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { ReassuranceBar } from "@/components/layout/reassurance-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { RangeeDefilante } from "@/components/ui/rangee-defilante";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import {
  indexCatalogue,
  listeCollections,
  listeMarques,
  produitsPlusApprecies,
} from "@/lib/catalogue";
import { boutique } from "@/config/boutique";
import { trier } from "@/lib/filtres";

// Les quatre familles de mouvements du catalogue, expliquées pour un premier achat.
const mouvements = [
  {
    cle: "AUTOMATIQUE",
    nom: "Automatique",
    texte:
      "Une masse oscillante remonte le ressort au rythme du poignet. Pas de pile : la montre vit tant qu'on la porte, et s'arrête après un à trois jours au repos.",
  },
  {
    cle: "MANUEL",
    nom: "Remontage manuel",
    texte:
      "On remonte la couronne quelques tours chaque matin. Le geste le plus ancien de l'horlogerie, et un calibre souvent plus fin.",
  },
  {
    cle: "QUARTZ",
    nom: "Quartz",
    texte:
      "Un cristal piloté par une pile, changée tous les deux à cinq ans. La plus précise et la plus simple à vivre.",
  },
  {
    cle: "SOLAIRE",
    nom: "Solaire",
    texte:
      "Le cadran capte la lumière, naturelle ou artificielle, et recharge un accumulateur. Aucune pile à changer.",
  },
] as const;

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Page d'accueil : hero, nouveautés, comprendre les mouvements, collections, maisons, avis, réassurance.
export default async function Accueil() {
  const [index, appreciees, collections, marques] = await Promise.all([
    indexCatalogue(),
    produitsPlusApprecies(),
    listeCollections(),
    listeMarques(),
  ]);
  // Les nouveautés écartent les montres déjà mises en avant plus bas, pour que les deux grilles diffèrent.
  const dejaMontrees = new Set(appreciees.map((p) => p.id));
  const nouveautes = trier(
    index.filter((p) => p.stock > 0 && !dejaMontrees.has(p.id)),
    "nouveautes",
  ).slice(0, 4);
  // La montre du hero : sa photo au poignet montre l'échelle mieux qu'une vue de face.
  const vedette = index.find((p) => p.slug === "hamilton-khaki-field-officer-auto-44mm-noir");
  const parMouvement = new Map<string, number>();
  for (const p of index) parMouvement.set(p.mouvement, (parMouvement.get(p.mouvement) ?? 0) + 1);

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          name: boutique.nom,
          url: site,
          email: boutique.contact.email,
          areaServed: "FR",
        }}
      />
      {/* Hero sombre */}
      <section className="bg-nuit text-acier">
        <Container className="grid items-center gap-10 py-10 md:grid-cols-[1.2fr_1fr] md:gap-12 md:py-20">
          <div className="animate-fondu">
            <h1 className="text-6xl leading-affiche tracking-titre md:text-7xl lg:text-8xl">
              Le temps,
              <br />
              <span className="text-cadran-clair">bien choisi.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-acier/75">
              Des montres de caractère, de 100 à 2 000 €, sélectionnées pièce par pièce.
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
          <div className="relative order-first aspect-4/3 w-full overflow-hidden rounded-cadre bg-blanc md:order-none md:aspect-square">
            <Image
              src="/images/montres/hamilton-khaki-field-officer-auto-44mm-noir-poignet.jpg"
              alt="Hamilton Khaki Field Officer Auto portée au poignet"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
            {vedette && (
              // Verre utile : la carte reste lisible quelle que soit la photo qu'elle recouvre.
              <Link
                href={`/montres/${vedette.slug}`}
                className="group absolute inset-x-3 bottom-3 flex items-center justify-between gap-4 rounded-controle bg-acier/90 px-4 py-3 text-encre backdrop-blur-verre transition-colors duration-(--duree-courte) ease-maison hover:bg-acier md:inset-x-4 md:bottom-4 transparence-reduite:bg-acier"
              >
                <span className="min-w-0">
                  <span className="block truncate font-serif text-lg leading-snug">
                    <span className="text-graphite">{vedette.marqueNom}</span> {vedette.nom}
                  </span>
                  <Price centimes={vedette.prixCentimes} className="text-sm" />
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-(--duree-moyenne) ease-maison group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            )}
          </div>
        </Container>
      </section>

      {/* Nouveautés */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading titre="Arrivées récentes" />
            <TextLink href="/montres?tri=nouveautes" className="text-sm font-medium">
              Voir toutes les nouveautés
            </TextLink>
          </div>
          <GrilleProduits produits={nouveautes} rail />
        </Container>
      </section>

      {/* Récit : comprendre le mouvement avant de choisir */}
      <section className="bg-blanc py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading
            titre="Ce qui fait battre une montre"
            description="Le mouvement décide de tout : comment la montre se remonte, sa précision, son entretien. Voici les quatre familles de notre sélection."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <dl className="divide-y divide-filet border-y border-filet">
            {mouvements.map((m) => {
              const nombre = parMouvement.get(m.cle) ?? 0;
              return (
                <div key={m.cle} className="grid gap-3 py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="font-serif text-3xl leading-titre">{m.nom}</dt>
                  <dd>
                    <p className="max-w-prose leading-relaxed text-graphite">{m.texte}</p>
                    {nombre > 0 && (
                      <TextLink
                        href={`/montres?mouvement=${m.cle.toLowerCase()}`}
                        className="chiffres mt-4 inline-block text-sm font-medium"
                      >
                        {nombre === 1 ? "Voir le modèle" : `Voir les ${nombre} montres`}
                      </TextLink>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>

      {/* Collections */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading titre="Choisir par envie" className="mb-12" />
          <RangeeDefilante className="grid gap-x-4 md:grid-cols-3 md:gap-x-6">
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="group flex h-full flex-col rounded-cadre"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-cadre bg-blanc">
                    {c.image && (
                      <Image
                        src={c.image.url}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 75vw"
                        className="object-cover transition-transform duration-(--duree-longue) ease-maison md:group-hover:scale-[1.03]"
                      />
                    )}
                    {/* Verre utile : le nom de la collection posé sur la photo, lisible sur tous les fonds. */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-4 rounded-controle bg-acier/90 px-4 py-3 backdrop-blur-verre md:inset-x-4 md:bottom-4 transparence-reduite:bg-acier">
                      <h3 className="text-2xl transition-colors group-hover:text-cadran">
                        {c.name}
                      </h3>
                      <ArrowRight
                        aria-hidden
                        className="size-5 shrink-0 transition-transform duration-(--duree-moyenne) ease-maison group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-graphite">{c.description}</p>
                </Link>
              </li>
            ))}
          </RangeeDefilante>
        </Container>
      </section>

      {/* Récit : les maisons, présentées comme un registre */}
      <section className="bg-blanc py-20 md:py-28">
        <Container>
          <SectionHeading
            titre={`${marques.length} maisons, deux écoles`}
            description="L'horlogerie suisse et l'horlogerie japonaise, réunies dans une même sélection. Chaque maison a son histoire et son style."
            className="mb-12"
          />
          <ul className="grid border-t border-filet md:grid-cols-2 md:gap-x-16">
            {marques.map((marque) => (
              <li key={marque.id} className="border-b border-filet">
                <Link
                  href={`/marques/${marque.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5"
                >
                  <span className="font-serif text-2xl transition-colors group-hover:text-cadran">
                    {marque.name}
                  </span>
                  <span className="chiffres text-sm text-graphite">
                    {[marque.country, marque.foundedYear && `depuis ${marque.foundedYear}`]
                      .filter(Boolean)
                      .join(" · ")}
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
              titre="Les plus appréciées"
              description="Les montres qui recueillent les meilleures notes."
              className="mb-12"
            />
            <GrilleProduits produits={appreciees} rail />
          </Container>
        </section>
      )}

      {/* Réassurance */}
      <section className="bg-blanc py-20 md:py-28">
        <Container>
          <SectionHeading
            centre
            titre="Acheter sereinement"
            description="Une belle montre est un achat qui compte. Chaque commande est vérifiée, assurée et accompagnée."
          />
          <ReassuranceBar className="mt-16" />
        </Container>
      </section>
    </>
  );
}
