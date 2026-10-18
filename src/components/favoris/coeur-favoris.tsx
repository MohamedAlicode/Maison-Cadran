"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useFavoris } from "./etat-favoris";

/** Cœur des favoris avec le nombre de montres gardées, en pastille comme celle du panier. */
export function CoeurFavoris() {
  const { nombre } = useFavoris();
  return (
    <span className="relative">
      <Heart aria-hidden className="size-5" strokeWidth={1.5} />
      {nombre > 0 && (
        <span
          aria-hidden
          className="chiffres absolute -top-2 -right-2.5 flex size-4.5 items-center justify-center rounded-full bg-cadran text-xs leading-none text-blanc"
        >
          {nombre}
        </span>
      )}
    </span>
  );
}

/** Accès aux favoris dans l'en-tête : le nombre est aussi annoncé aux lecteurs d'écran. */
export function LienFavoris({ className }: { className?: string }) {
  const { nombre } = useFavoris();
  return (
    <Link
      href="/compte/favoris"
      className={className}
      aria-label={
        nombre === 0 ? "Mes favoris" : `Mes favoris, ${nombre} montre${nombre > 1 ? "s" : ""}`
      }
    >
      <CoeurFavoris />
    </Link>
  );
}
