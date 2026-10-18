"use client";

import { Award, CalendarClock, Pause, Play, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { boutique } from "@/config/boutique";
import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex shrink-0 items-center gap-12 py-2.5 pr-12 text-xs text-graphite",
        copie && "motion-reduce:hidden",
      )}
    >
      {tour.map(({ icone: Icone, texte }, i) => (
        <li
          key={i}
          aria-hidden={i >= messages.length || undefined}
          className={cn(
            "flex shrink-0 items-center gap-2",
            i >= messages.length && "motion-reduce:hidden",
          )}
        >
          <Icone aria-hidden className="size-4 text-cadran" strokeWidth={1.5} />
          {texte}
        </li>
      ))}
    </ul>
  );
}

/**
 * Banderole du haut de page : les messages défilent en boucle. Le défilement s'arrête au survol,
 * au focus et sur le bouton pause (un texte qui bouge plus de 5 s doit pouvoir être arrêté).
 * Avec le mouvement réduit, la bande ne bouge pas et se fait défiler à la main.
 */
export function Banderole() {
  const [enPause, setEnPause] = useState(false);
  return (
    <div
      role="region"
      aria-label="Offres de la boutique"
      data-pause={enPause || undefined}
      className="group/banderole flex border-b border-filet bg-blanc"
    >
      <div className="min-w-0 flex-1 overflow-hidden motion-reduce:[scrollbar-width:none] motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-banderole group-focus-within/banderole:[animation-play-state:paused] group-hover/banderole:[animation-play-state:paused] group-data-pause/banderole:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:pl-6">
          <Messages />
          <Messages copie />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEnPause(!enPause)}
        aria-pressed={enPause}
        aria-label="Mettre la banderole en pause"
        className="grid w-11 shrink-0 place-items-center border-l border-filet bg-blanc text-graphite transition-colors duration-(--duree-courte) ease-maison hover:text-encre focus-visible:-outline-offset-2 motion-reduce:hidden"
      >
        <Pause aria-hidden className="size-4 group-data-pause/banderole:hidden" strokeWidth={1.5} />
        <Play
          aria-hidden
          className="hidden size-4 group-data-pause/banderole:block"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
