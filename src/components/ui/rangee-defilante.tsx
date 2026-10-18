"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Liste qui défile sur une ligne sous 768 px (cartes, collections) et reprend sa grille au-dessus.
 * Au clavier, l'élément qui prend le focus est ramené à l'écran : Chromium ne le fait pas
 * quand il est déjà en partie visible.
 * À la souris, on fait glisser la rangée comme au doigt : une fenêtre étroite sur ordinateur
 * n'a pas d'autre moyen de la faire défiler.
 */
export function RangeeDefilante({ className, ...props }: ComponentProps<"ul">) {
  const glisse = useRef<{ x: number; depart: number; bouge: boolean } | null>(null);
  const vientDeGlisser = useRef(false);

  function finir(e: PointerEvent<HTMLUListElement>) {
    if (!glisse.current) return;
    vientDeGlisser.current = glisse.current.bouge;
    glisse.current = null;
    e.currentTarget.style.scrollSnapType = "";
  }

  return (
    <ul
      onFocus={(e) =>
        e.target.closest("li")?.scrollIntoView({ block: "nearest", inline: "nearest" })
      }
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        const el = e.currentTarget;
        vientDeGlisser.current = false;
        if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
        glisse.current = { x: e.clientX, depart: el.scrollLeft, bouge: false };
      }}
      onPointerMove={(e) => {
        const g = glisse.current;
        if (!g) return;
        const ecart = e.clientX - g.x;
        // Quelques pixels de tolérance : un clic un peu tremblé reste un clic sur la carte.
        if (!g.bouge && Math.abs(ecart) < 6) return;
        if (!g.bouge) {
          g.bouge = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.style.scrollSnapType = "none";
        }
        e.currentTarget.scrollLeft = g.depart - ecart;
      }}
      onPointerUp={finir}
      onPointerCancel={finir}
      // Le relâché d'un glissé ne doit pas ouvrir la fiche de la carte sous la souris.
      onClickCapture={(e) => {
        if (!vientDeGlisser.current) return;
        vientDeGlisser.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "max-md:-mx-6 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-6 max-md:[scrollbar-width:none] max-md:overflow-x-auto max-md:px-6 max-md:py-2",
        "max-md:*:w-3/4 max-md:*:shrink-0 max-md:*:snap-start",
        className,
      )}
      {...props}
    />
  );
}
