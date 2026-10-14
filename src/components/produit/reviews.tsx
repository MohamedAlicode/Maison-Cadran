import { BadgeCheck } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import type { FicheProduit } from "@/lib/catalogue";

const formatDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Avis clients modérés. Le dépôt d'un avis arrivera avec les comptes clients. */
export function Reviews({ produit }: { produit: FicheProduit }) {
  const { reviews, noteMoyenne } = produit;

  if (reviews.length === 0 || noteMoyenne === null) {
    return (
      <p className="text-graphite">
        Aucun avis pour le moment. Les clients ayant acheté cette montre pourront bientôt partager
        leur expérience.
      </p>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
      <div>
        <p className="chiffres font-serif text-6xl leading-none">
          {noteMoyenne.toLocaleString("fr-FR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          <span className="text-2xl text-graphite"> / 5</span>
        </p>
        <Stars note={noteMoyenne} taille="md" className="mt-3" />
        <p className="mt-2 text-sm text-graphite">
          {reviews.length} avis client{reviews.length > 1 ? "s" : ""}
        </p>
      </div>
      <ul className="divide-y divide-sable border-y border-sable">
        {reviews.map((avis) => (
          <li key={avis.id} className="py-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Stars note={avis.rating} />
              {avis.title && <p className="font-medium">{avis.title}</p>}
            </div>
            <p className="mt-3 max-w-prose leading-relaxed text-graphite">{avis.body}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 text-xs text-graphite">
              <span className="text-encre">{avis.auteur}</span>
              <time dateTime={avis.createdAt.toISOString()}>
                {formatDate.format(avis.createdAt)}
              </time>
              {avis.achatVerifie && (
                <span className="inline-flex items-center gap-1 text-sauge">
                  <BadgeCheck aria-hidden className="size-3.5" /> Achat vérifié
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
