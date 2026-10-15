"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Liste qui défile sur une ligne sous 768 px (cartes, collections) et reprend sa grille au-dessus.
 * Au clavier, l'élément qui prend le focus est ramené à l'écran : Chromium ne le fait pas
 * quand il est déjà en partie visible.
 */
export function RangeeDefilante({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      onFocus={(e) =>
        e.target.closest("li")?.scrollIntoView({ block: "nearest", inline: "nearest" })
      }
      className={cn(
        "max-md:-mx-6 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-6 max-md:[scrollbar-width:none] max-md:overflow-x-auto max-md:px-6 max-md:py-2",
        "max-md:*:w-3/4 max-md:*:shrink-0 max-md:*:snap-start",
        className,
      )}
      {...props}
    />
  );
}
