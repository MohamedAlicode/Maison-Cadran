import { Gift, ShieldCheck, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GrilleProduits } from "@/components/catalogue/product-card";
import { engagements } from "@/components/layout/reassurance-bar";
import { Gallery } from "@/components/produit/gallery";
import { Reviews } from "@/components/produit/reviews";
import { SpecsTable } from "@/components/produit/specs-table";
import { StockInfo } from "@/components/produit/stock-info";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { boutique } from "@/config/boutique";
import {
  produitParSlug,
  produitsSimilaires,
  slugsProduits,
  type FicheProduit,
} from "@/lib/catalogue";
import { libelleCouleur, libellesMouvement } from "@/lib/libelles";
import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";
import { teintesCadran } from "@/lib/visuels";

export async function generateStaticParams() {
  const slugs = await slugsProduits();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/montres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produit = await produitParSlug(slug);
  if (!produit) return { title: "Montre introuvable" };
  const titre =
    produit.metaTitle ??
    `${produit.brand.name} ${produit.name} ${libelleCouleur(produit.dialColor).toLowerCase()}`;
  return {
    title: titre,
    description:
      produit.metaDescription ??
      `${produit.shortDescription} ${formatPrixCourt(produit.priceCents)}, livraison assurée, retours gratuits sous 14 jours.`,
    alternates: { canonical: `/montres/${produit.slug}` },
    openGraph: {
      title: `${produit.brand.name} ${produit.name}`,
      images: produit.images[0]
        ? [{ url: produit.images[0].url, alt: produit.images[0].alt }]
        : undefined,
    },
  };
}

/** Données structurées Product et BreadcrumbList (schema.org). */
function donneesStructurees(produit: FicheProduit) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${site}/montres/${produit.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${produit.brand.name} ${produit.name}`,
      sku: produit.reference,
      mpn: produit.reference,
      description: produit.shortDescription,
      image: produit.images.map((i) => `${site}${i.url}`),
      brand: { "@type": "Brand", name: produit.brand.name },
      color: libelleCouleur(produit.dialColor),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "EUR",
        price: (produit.priceCents / 100).toFixed(2),
        itemCondition: "https://schema.org/NewCondition",
        availability:
          produit.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: boutique.nom },
      },
      ...(produit.noteMoyenne !== null && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: produit.noteMoyenne.toFixed(1),
          reviewCount: produit.reviews.length,
        },
        review: produit.reviews.slice(0, 5).map((r) => ({
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          author: { "@type": "Person", name: r.auteur },
          reviewBody: r.body,
        })),
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: site },
        { "@type": "ListItem", position: 2, name: "Montres", item: `${site}/montres` },
        {
          "@type": "ListItem",
          position: 3,
          name: produit.brand.name,
          item: `${site}/marques/${produit.brand.slug}`,
        },
        { "@type": "ListItem", position: 4, name: produit.name, item: url },
      ],
    },
  ];
}

/** Pastilles des autres coloris du même modèle. */
function Declinaisons({ produit }: { produit: FicheProduit }) {
  if (produit.declinaisons.length < 2) return null;
  return (
    <div>
      <p className="text-sm">
        Cadran : <span className="text-graphite">{libelleCouleur(produit.dialColor)}</span>
      </p>
      <ul className="mt-3 flex gap-3">
        {produit.declinaisons.map((d) => {
          const courant = d.slug === produit.slug;
          return (
            <li key={d.slug}>
              <Link
                href={`/montres/${d.slug}`}
                aria-label={`Cadran ${libelleCouleur(d.dialColor).toLowerCase()}${d.stock <= 0 ? " (épuisé)" : ""}`}
                aria-current={courant ? "true" : undefined}
                className={cn(
                  "block size-9 rounded-full ring-1 ring-offset-2 ring-offset-creme transition",
                  courant ? "ring-encre" : "ring-sable hover:ring-sable-fonce",
                )}
                style={{ backgroundColor: teintesCadran[d.dialColor] ?? "#888" }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

async function FicheProduitContenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produit = await produitParSlug(slug);
  if (!produit) notFound();

  const similaires = await produitsSimilaires(slug);
  const livraisonOfferte = produit.priceCents >= boutique.livraison.seuilGratuitCentimes;
  const disponible = produit.stock > 0;

  return (
    <>
      <JsonLd donnees={{ "@graph": donneesStructurees(produit) }} />

      <Container className="py-6 md:py-10">
        <Breadcrumb
          miettes={[
            { libelle: "Accueil", href: "/" },
            { libelle: "Montres", href: "/montres" },
            { libelle: produit.brand.name, href: `/marques/${produit.brand.slug}` },
            { libelle: produit.name },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16 xl:gap-24">
          <Gallery images={produit.images.map((i) => ({ url: i.url, alt: i.alt }))} />

          <div className="lg:sticky lg:top-36 lg:self-start">
            <Link
              href={`/marques/${produit.brand.slug}`}
              className="text-xs font-medium tracking-surtitre text-graphite uppercase hover:text-encre"
            >
              {produit.brand.name}
            </Link>
            <h1 className="mt-2 text-4xl leading-[1.05] md:text-5xl">{produit.name}</h1>
            <p className="chiffres mt-3 text-sm text-graphite">
              Réf. {produit.reference} · {libellesMouvement[produit.movement]}
            </p>

            {produit.noteMoyenne !== null && (
              <a
                href="#avis"
                className="mt-4 inline-flex items-center gap-2 text-sm text-graphite hover:text-encre"
              >
                <Stars note={produit.noteMoyenne} />
                <span className="chiffres underline-offset-4 hover:underline">
                  {produit.reviews.length} avis
                </span>
              </a>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <Price
                centimes={produit.priceCents}
                barreCentimes={produit.compareAtCents}
                className="text-2xl"
              />
            </div>
            <p className="mt-1 text-xs text-graphite">
              TTC, TVA 20 % incluse
              {livraisonOfferte ? " · Livraison assurée offerte" : ""} · Paiement en plusieurs fois
              possible
            </p>

            <p className="mt-6 leading-relaxed">{produit.shortDescription}</p>

            <div className="mt-8 space-y-8">
              <Declinaisons produit={produit} />

              <div>
                {/* Le panier arrive en phase 3 : le bouton est affiché pour valider la mise en page. */}
                <Button
                  pleineLargeur
                  taille="lg"
                  disabled={!disponible}
                  aria-describedby="note-panier"
                >
                  <ShoppingBag aria-hidden className="size-4" strokeWidth={1.5} />
                  {disponible ? "Ajouter au panier" : "Épuisée"}
                </Button>
                <p id="note-panier" className="mt-2 text-center text-xs text-graphite">
                  {disponible
                    ? "Commande en ligne bientôt disponible."
                    : "Contactez-nous pour être prévenu de son retour."}
                </p>
              </div>

              <StockInfo
                stock={produit.stock}
                delaiJours={produit.leadTimeDays}
                seuilBas={produit.lowStockThreshold}
              />

              <div className="border-y border-sable py-6">
                <p className="text-xs font-medium tracking-surtitre text-laiton-fonce uppercase">
                  Ce qui est inclus
                </p>
                <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <Gift aria-hidden className="size-4 text-laiton" strokeWidth={1.5} /> Écrin
                    d&apos;origine {produit.brand.name}
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck aria-hidden className="size-4 text-laiton" strokeWidth={1.5} />{" "}
                    Garantie {produit.warrantyMonths / 12} ans
                  </li>
                  {engagements
                    .slice(0, 1)
                    .concat(engagements.slice(3))
                    .map(({ icone: Icone, titre }) => (
                      <li key={titre} className="flex items-center gap-3">
                        <Icone aria-hidden className="size-4 text-laiton" strokeWidth={1.5} />{" "}
                        {titre}
                      </li>
                    ))}
                </ul>
              </div>

              <Accordion type="multiple" className="-mt-2">
                <AccordionItem value="livraison">
                  <AccordionTrigger>Livraison et retours</AccordionTrigger>
                  <AccordionContent>
                    Expédition en {boutique.livraison.transporteur.toLowerCase()}, assurée pour la
                    valeur de la montre. Livraison offerte dès{" "}
                    {formatPrixCourt(boutique.livraison.seuilGratuitCentimes)},{" "}
                    {formatPrixCourt(boutique.livraison.fraisCentimes)} en dessous. Vous disposez de{" "}
                    {boutique.retours.joursRetractation} jours pour nous retourner la montre
                    gratuitement, non portée et avec ses protections d&apos;origine.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="garantie">
                  <AccordionTrigger>Garantie et authenticité</AccordionTrigger>
                  <AccordionContent>
                    Chaque montre est neuve, contrôlée avant expédition et livrée avec son écrin,
                    ses documents d&apos;origine et sa facture. Elle bénéficie d&apos;une garantie
                    de {produit.warrantyMonths / 12} ans, en plus de la garantie légale de
                    conformité.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </Container>

      {/* Description et avis de la maison */}
      <section className="mt-16 border-t border-sable bg-ivoire py-16 md:mt-24 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading surtitre="Description" titre={`À propos de la ${produit.name}`} />
            <p className="mt-8 max-w-prose leading-relaxed text-graphite">{produit.description}</p>
          </div>
          {produit.editorialNote && (
            <figure className="self-end border-l border-laiton pl-8">
              <p className="text-xs font-medium tracking-surtitre text-laiton-fonce uppercase">
                L&apos;avis de la maison
              </p>
              <blockquote className="mt-4 font-serif text-2xl leading-snug italic md:text-3xl">
                « {produit.editorialNote} »
              </blockquote>
            </figure>
          )}
        </Container>
      </section>

      {/* Caractéristiques */}
      <section className="py-16 md:py-24" aria-labelledby="caracteristiques">
        <Container>
          <h2 id="caracteristiques" className="mb-10 text-3xl md:text-4xl">
            Caractéristiques techniques
          </h2>
          <SpecsTable produit={produit} />
        </Container>
      </section>

      {/* Avis clients */}
      <section
        id="avis"
        className="scroll-mt-32 border-t border-sable py-16 md:py-24"
        aria-labelledby="titre-avis"
      >
        <Container>
          <h2 id="titre-avis" className="mb-10 text-3xl md:text-4xl">
            Avis clients
          </h2>
          <Reviews produit={produit} />
        </Container>
      </section>

      {/* Montres similaires */}
      {similaires.length > 0 && (
        <section className="border-t border-sable py-16 md:py-24" aria-labelledby="similaires">
          <Container>
            <h2 id="similaires" className="mb-10 text-3xl md:text-4xl">
              Vous aimerez aussi
            </h2>
            <GrilleProduits produits={similaires} />
          </Container>
        </section>
      )}
    </>
  );
}

function FicheSquelette() {
  return (
    <Container className="py-6 md:py-10" aria-hidden>
      <div className="h-4 w-64 bg-sable/60" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16 xl:gap-24">
        <div className="aspect-square animate-pulse bg-ivoire" />
        <div className="space-y-4">
          <div className="h-3 w-20 bg-sable/60" />
          <div className="h-12 w-3/4 bg-sable/60" />
          <div className="h-8 w-28 bg-sable/60" />
        </div>
      </div>
    </Container>
  );
}

export default function PageProduit({ params }: PageProps<"/montres/[slug]">) {
  return (
    <Suspense fallback={<FicheSquelette />}>
      <FicheProduitContenu params={params} />
    </Suspense>
  );
}
