import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";

type Proprietes = {
  centimes: number;
  /** Prix barré éventuel. */
  barreCentimes?: number | null;
  className?: string;
};

/** Prix TTC en chiffres tabulaires, avec prix barré optionnel. */
export function Price({ centimes, barreCentimes, className }: Proprietes) {
  return (
    <p className={cn("chiffres flex items-baseline gap-2", className)}>
      <span>{formatPrixCourt(centimes)}</span>
      {barreCentimes && barreCentimes > centimes && (
        <span className="text-sm text-graphite line-through">
          <span className="sr-only">Au lieu de </span>
          {formatPrixCourt(barreCentimes)}
        </span>
      )}
    </p>
  );
}
