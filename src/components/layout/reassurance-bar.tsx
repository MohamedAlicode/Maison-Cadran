import { RotateCcw, ShieldCheck, Truck, Award } from "lucide-react";
import { boutique } from "@/config/boutique";
import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";

// Les quatre engagements de la boutique, repris sur l'accueil et sur chaque fiche produit.
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

/** Les quatre engagements en grille, sur l'accueil et le design system. */
export function ReassuranceBar({ className }: { className?: string }) {
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
