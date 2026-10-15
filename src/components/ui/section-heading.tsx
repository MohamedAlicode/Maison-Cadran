import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

type Proprietes = {
  surtitre?: string;
  titre: string;
  description?: ReactNode;
  centre?: boolean;
  className?: string;
  /** Niveau de titre, h2 par défaut. */
  as?: "h1" | "h2" | "h3";
};

/** En-tête de section : grand titre serif, la taille suffit à le détacher. */
export function SectionHeading({
  surtitre,
  titre,
  description,
  centre = false,
  className,
  as: Titre = "h2",
}: Proprietes) {
  return (
    <div className={cn("max-w-2xl", centre && "mx-auto text-center", className)}>
      {surtitre && <Eyebrow className="mb-3">{surtitre}</Eyebrow>}
      <Titre className="text-4xl leading-titre text-balance md:text-6xl">{titre}</Titre>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-pretty text-graphite">{description}</p>
      )}
    </div>
  );
}
