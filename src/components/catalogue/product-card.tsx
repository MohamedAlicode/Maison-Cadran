import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import type { ProduitIndexe } from "@/lib/filtres";
import { cn } from "@/lib/utils";

type Proprietes = {
  produit: ProduitIndexe;
  /** À activer pour les premières cartes visibles (chargement prioritaire de l'image). */
  prioritaire?: boolean;
  /** Niveau du titre de la carte selon la page (h2 dans une grille principale, h3 sinon). */
  niveauTitre?: "h2" | "h3";
};

/** Pastille affichée sur la photo : rupture, dernière pièce, offre ou nouveauté. */
function badgeProduit(p: ProduitIndexe) {
  if (p.stock <= 0) return { libelle: "Épuisée", variante: "neutre" as const };
  if (p.stock === 1) return { libelle: "Dernière pièce", variante: "alerte" as const };
  if (p.prixBarreCentimes && p.prixBarreCentimes > p.prixCentimes)
    return { libelle: "Offre", variante: "cadran" as const };
  if (p.nouveau) return { libelle: "Nouveau", variante: "nouveau" as const };
  return null;
}

/** Carte produit du catalogue : photo carrée, marque et nom en serif, prix tabulaire. */
export function ProductCard({
  produit,
  prioritaire = false,
  niveauTitre: Titre = "h3",
}: Proprietes) {
  const badge = badgeProduit(produit);
  const tailles = "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 72vw";

  return (
    <article className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-cadre bg-blanc">
        {produit.image && (
          <Image
            src={produit.image.url}
            alt={produit.image.alt}
            fill
            sizes={tailles}
            priority={prioritaire}
            className={cn(
              "object-contain p-(--marge-photo) transition-[opacity,transform] duration-(--duree-longue) ease-maison",
              produit.imageSurvol ? "md:group-hover:opacity-0" : "md:group-hover:scale-[1.03]",
              produit.stock <= 0 && "opacity-60",
            )}
          />
        )}
        {produit.imageSurvol && (
          <Image
            src={produit.imageSurvol.url}
            alt=""
            fill
            sizes={tailles}
            className="hidden object-contain p-(--marge-photo-serree) opacity-0 transition-opacity duration-(--duree-longue) ease-maison md:block md:group-hover:opacity-100"
          />
        )}
        {badge && (
          <Badge variante={badge.variante} className="absolute top-3 left-3">
            {badge.libelle}
          </Badge>
        )}
      </div>
      <div className="pt-4">
        {/* La marque ouvre le titre, en gris, plutôt qu'en sur-titre au-dessus (déconseillé). */}
        <Titre className="font-serif text-xl leading-snug">
          <Link
            href={`/montres/${produit.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-cadran"
          >
            <span className="text-graphite">{produit.marqueNom}</span> {produit.nom}
          </Link>
        </Titre>
        <p className="mt-0.5 text-sm text-graphite">{produit.detail}</p>
        <Price
          centimes={produit.prixCentimes}
          barreCentimes={produit.prixBarreCentimes}
          className="mt-2 text-base"
        />
      </div>
    </article>
  );
}

/** Grille de cartes : 2 colonnes sur mobile, puis 4 (ou 3 à côté de la colonne de filtres). */
export function GrilleProduits({
  produits,
  colonnes = 4,
  niveauTitre,
  rail = false,
}: {
  produits: ProduitIndexe[];
  colonnes?: 3 | 4;
  niveauTitre?: "h2" | "h3";
  /** Sous 768 px, les cartes défilent sur une ligne au lieu de s'empiler : la page reste courte. */
  rail?: boolean;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6",
        // Une grille de 4 passe directement à 4 colonnes : en 3, la quatrième carte resterait seule.
        colonnes === 4 ? "md:grid-cols-4" : "md:grid-cols-3",
        rail &&
          "max-md:-mx-6 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-6 max-md:[scrollbar-width:none] max-md:overflow-x-auto max-md:px-6 max-md:pb-2",
      )}
    >
      {produits.map((produit, i) => (
        <li
          key={produit.id}
          className={cn(rail && "max-md:w-[72%] max-md:shrink-0 max-md:snap-start")}
        >
          <ProductCard produit={produit} prioritaire={i < 4} niveauTitre={niveauTitre} />
        </li>
      ))}
    </ul>
  );
}
