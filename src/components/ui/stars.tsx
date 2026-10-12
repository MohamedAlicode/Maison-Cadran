import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Note sur 5 en étoiles fines. Le texte accessible donne la note exacte. */
export function Stars({
  note,
  className,
  taille = "sm",
}: {
  note: number;
  className?: string;
  taille?: "sm" | "md";
}) {
  const arrondie = Math.round(note * 2) / 2;
  const classeEtoile = taille === "md" ? "size-4.5" : "size-3.5";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-cadran", className)}>
      <span className="sr-only">
        Note : {note.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} sur 5
      </span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden className="relative">
          <Star className={cn(classeEtoile, "text-filet-fort")} strokeWidth={1.5} />
          {arrondie >= i - 0.5 && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: arrondie >= i ? "100%" : "50%" }}
            >
              <Star className={cn(classeEtoile, "fill-cadran text-cadran")} strokeWidth={1.5} />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
