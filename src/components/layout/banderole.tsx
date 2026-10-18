"use client";

import { Award, CalendarClock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { boutique } from "@/config/boutique";
import { formatPrixCourt } from "@/lib/prix";

// Uniquement des offres que la boutique applique vraiment : une ligne ajoutée ici apparaît partout.
const messages = [
  {
    icone: Truck,
    texte: `Livraison offerte dès ${formatPrixCourt(boutique.livraison.seuilGratuitCentimes)}`,
  },
  { icone: RotateCcw, texte: `Retours gratuits sous ${boutique.retours.joursRetractation} jours` },
  { icone: CalendarClock, texte: "Paiement en 3 ou 4 fois avec Klarna" },
  { icone: ShieldCheck, texte: `Garantie ${boutique.garantieMois / 12} ans` },
  { icone: Award, texte: "Authenticité garantie" },
];

function Messages({ copie = false }: { copie?: boolean }) {
  // Deux tours de messages par copie : la bande reste pleine sur les écrans les plus larges.
  const tour = [...messages, ...messages];
  return (
    <ul
      aria-hidden={copie || undefined}
      className="flex shrink-0 items-center gap-12 py-2.5 pr-12 text-xs text-graphite"
    >
      {tour.map(({ icone: Icone, texte }, i) => (
        <li
          key={i}
          aria-hidden={i >= messages.length || undefined}
          className="flex shrink-0 items-center gap-2"
        >
          <Icone aria-hidden className="size-4 text-cadran" strokeWidth={1.5} />
          {texte}
        </li>
      ))}
    </ul>
  );
}

/**
 * Banderole du haut de page : les messages défilent en boucle, sans arrêt.
 * Choix de Boss : le rouleau tourne aussi en mouvement réduit, et sans bouton pause.
 */
export function Banderole() {
  return (
    <div
      role="region"
      aria-label="Offres de la boutique"
      className="flex border-b border-filet bg-blanc"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="banderole-continue flex w-max animate-banderole">
          <Messages />
          <Messages copie />
        </div>
      </div>
    </div>
  );
}
