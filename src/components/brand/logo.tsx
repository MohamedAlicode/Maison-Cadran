import Link from "next/link";
import { boutique } from "@/config/boutique";
import { cn } from "@/lib/utils";

/** Logotype provisoire : nom en serif, petit filet bleu cadran. */
export function Logo({ className, clair = false }: { className?: string; clair?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex flex-col items-center leading-none", className)}
      aria-label={`${boutique.nom}, accueil`}
    >
      <span
        className={cn(
          "font-serif text-2xl tracking-logo uppercase md:text-3xl",
          clair ? "text-acier" : "text-encre",
        )}
      >
        {boutique.nom}
      </span>
      <span
        aria-hidden
        className={cn("mt-1.5 h-px w-8", clair ? "bg-cadran-clair" : "bg-cadran")}
      />
    </Link>
  );
}
