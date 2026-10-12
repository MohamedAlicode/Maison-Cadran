import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { ReassuranceBar } from "@/components/layout/reassurance-bar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import {
  indexCatalogue,
  listeCollections,
  listeMarques,
  produitsPlusApprecies,
} from "@/lib/catalogue";
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
  const parMouvement = new Map<string, number>();
  for (const p of index) parMouvement.set(p.mouvement, (parMouvement.get(p.mouvement) ?? 0) + 1);

  return (
    <>
      {/* Hero sombre */}
      <section className="bg-nuit text-acier">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 lg:py-32">
          <div className="animate-fondu">
            <h1 className="text-5xl leading-affiche md:text-6xl lg:text-7xl">
              Le temps,
              <br />
              <span className="text-cadran-clair">bien choisi.</span>
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
          <div className="relative order-first mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-full bg-blanc sm:max-w-sm md:order-none md:max-w-md">
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
            <SectionHeading titre="Arrivées récentes" />
            <TextLink href="/montres?tri=nouveautes" className="text-sm font-medium">
              Voir toutes les nouveautés
            </TextLink>
          </div>
          <GrilleProduits produits={nouveautes} />
        </Container>
      </section>

      {/* Récit : comprendre le mouvement avant de choisir */}
      <section className="border-y border-filet bg-blanc py-20 md:py-28">
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
          <ul className="grid gap-px bg-filet md:grid-cols-3">
            {collections.map((c) => (
              <li key={c.id} className="bg-acier">
                <Link
                  href={`/collections/${c.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-blanc"
                >
                  {c.image && (
                    <div className="relative mb-8 aspect-4/3 bg-blanc">
                      <Image
                        src={c.image.url}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="object-contain p-(--marge-photo)"
                      />
                    </div>
                  )}
                  <h3 className="text-3xl transition-colors group-hover:text-cadran">{c.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite">
                    {c.description}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-libelle font-medium tracking-surtitre uppercase">
                    Découvrir
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-(--duree-moyenne) ease-maison group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Récit : les maisons, présentées comme un registre */}
      <section className="border-y border-filet bg-blanc py-20 md:py-28">
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
            <GrilleProduits produits={appreciees} />
          </Container>
        </section>
      )}

      {/* Réassurance */}
      <section className="border-t border-filet bg-blanc py-20 md:py-28">
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
