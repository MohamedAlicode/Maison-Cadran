import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type Miette = { libelle: string; href?: string };

/** Fil d'Ariane. Le dernier élément est la page courante. */
export function Breadcrumb({ miettes }: { miettes: Miette[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs text-graphite">
      <ol className="flex flex-wrap items-center gap-1.5">
        {miettes.map((m, i) => (
          <li key={m.libelle} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3 text-sable-fonce" />}
            {m.href ? (
              <Link href={m.href} className="transition-colors hover:text-encre">
                {m.libelle}
              </Link>
            ) : (
              <span aria-current="page" className="text-encre">
                {m.libelle}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
