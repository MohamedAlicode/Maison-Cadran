import { Heart } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";

export type ProduitCarte = {
  slug: string;
  marque: string;
  nom: string;
  detail: string;
  prixCentimes: number;
  prixBarreCentimes?: number | null;
  badge?: { libelle: string; variante: "nouveau" | "alerte" | "laiton" };
};

type Proprietes = {
  produit: ProduitCarte;
  /** Visuel principal (photo ou illustration). */
  visuel: ReactNode;
  /** Second visuel révélé au survol (desktop). */
  visuelSurvol?: ReactNode;
};

/** Carte produit du catalogue : photo carrée, marque, nom serif, prix tabulaire. */
export function ProductCard({ produit, visuel, visuelSurvol }: Proprietes) {
  return (
    <article className="group relative">
      <div className="relative aspect-square overflow-hidden bg-blanc">
        <div
          className={cn(
            "absolute inset-0 grid place-items-center p-[14%] transition-opacity duration-500 ease-maison",
            visuelSurvol && "md:group-hover:opacity-0",
          )}
        >
          {visuel}
        </div>
        {visuelSurvol && (
          <div className="absolute inset-0 grid place-items-center p-[8%] opacity-0 transition-opacity duration-500 ease-maison md:group-hover:opacity-100">
            {visuelSurvol}
          </div>
        )}
        {produit.badge && (
          <Badge variante={produit.badge.variante} className="absolute top-3 left-3">
            {produit.badge.libelle}
          </Badge>
        )}
        <button
          type="button"
          aria-label={`Ajouter ${produit.marque} ${produit.nom} aux favoris`}
          className="absolute right-2 bottom-2 z-10 grid size-10 place-items-center rounded-xs text-graphite transition hover:text-encre md:top-2 md:bottom-auto md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        >
          <Heart className="size-[18px]" strokeWidth={1.5} />
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[11px] font-medium tracking-surtitre text-graphite uppercase">
          {produit.marque}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-snug">
          <Link href={`/montres/${produit.slug}`} className="after:absolute after:inset-0">
            {produit.nom}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-graphite">{produit.detail}</p>
        <Price
          centimes={produit.prixCentimes}
          barreCentimes={produit.prixBarreCentimes}
          className="mt-2 text-[15px]"
        />
      </div>
    </article>
  );
}
