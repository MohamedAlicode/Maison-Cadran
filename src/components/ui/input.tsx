import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Style commun aux champs de saisie : fond blanc, bordure filet, focus encre + anneau bleu cadran. */
export const classeSaisie = cn(
  "h-12 w-full rounded-controle border border-filet bg-blanc px-4 text-base text-encre",
  "transition-colors duration-(--duree-courte) placeholder:text-graphite/70",
  "focus-visible:border-encre focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cadran",
  "aria-invalid:border-bordeaux",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

export function Input({ className, "aria-invalid": invalide, ...props }: ComponentProps<"input">) {
  return <input aria-invalid={invalide} className={cn(classeSaisie, className)} {...props} />;
}
