import { cn } from "@/lib/utils";

type Proprietes = {
  valeur: number;
  max: number;
  label: string;
  className?: string;
};

/** Barre de progression fine (ex. « Plus que 32 € pour la livraison offerte »). */
export function Progress({ valeur, max, label, className }: Proprietes) {
  const pourcentage = Math.min(100, Math.round((valeur / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(valeur, max)}
      className={cn("h-0.75 w-full overflow-hidden bg-filet", className)}
    >
      <div
        className="h-full bg-cadran transition-[width] duration-(--duree-longue) ease-maison"
        style={{ width: `${pourcentage}%` }}
      />
    </div>
  );
}
