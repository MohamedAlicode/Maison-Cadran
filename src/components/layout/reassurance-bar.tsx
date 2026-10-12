import { RotateCcw, ShieldCheck, Truck, Award } from "lucide-react";
import { boutique } from "@/config/boutique";
import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";

// Les quatre engagements de la boutique, repris sous le header et sur chaque fiche produit.
// Formulation volontairement neutre (« garantie 2 ans ») tant que le statut de revendeur
// agréé n'est pas confirmé : la mention « garantie constructeur » est réservée au réseau officiel.
export const engagements = [
  { icone: Award, titre: "Authenticité garantie", detail: "Montres neuves, certificat fourni" },
  {
    icone: ShieldCheck,
    titre: `Garantie ${boutique.garantieMois / 12} ans`,
    detail: "Écrin et documents d'origine",
  },
  {
    icone: Truck,
    titre: "Livraison assurée",
    detail: `Offerte dès ${formatPrixCourt(boutique.livraison.seuilGratuitCentimes)}, contre signature`,
  },
  {
    icone: RotateCcw,
    titre: "Retours gratuits",
    detail: `Sous ${boutique.retours.joursRetractation} jours`,
  },
] as const;

/** Bandeau de réassurance. Version « compacte » sur une ligne pour le haut de page. */
export function ReassuranceBar({
  compacte = false,
  className,
}: {
  compacte?: boolean;
  className?: string;
}) {
  if (compacte) {
    return (
      <div className={cn("border-b border-filet bg-blanc", className)}>
        <ul className="mx-auto flex max-w-site items-center justify-center gap-8 overflow-x-auto px-6 py-2.5 text-xs text-graphite lg:justify-between lg:px-12">
          {engagements.map(({ icone: Icone, titre }, i) => (
            <li
              key={titre}
              className={cn("flex shrink-0 items-center gap-2", i > 0 && "hidden md:flex")}
            >
              <Icone aria-hidden className="size-4 text-cadran" strokeWidth={1.5} />
              {titre}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4", className)}>
      {engagements.map(({ icone: Icone, titre, detail }) => (
        <li key={titre} className="flex flex-col items-center text-center">
          <Icone aria-hidden className="mb-4 size-7 text-cadran" strokeWidth={1.25} />
          <p className="font-serif text-xl">{titre}</p>
          <p className="mt-1.5 text-sm text-graphite">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
