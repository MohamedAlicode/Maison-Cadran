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

/** En-tête de section : sur-titre, titre serif et filet laiton. */
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
      <Titre className="text-3xl leading-[1.1] md:text-5xl">{titre}</Titre>
      <span aria-hidden className={cn("mt-5 block h-px w-12 bg-laiton", centre && "mx-auto")} />
      {description && <p className="mt-5 leading-relaxed text-graphite">{description}</p>}
    </div>
  );
}
