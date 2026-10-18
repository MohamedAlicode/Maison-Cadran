import { Award, CalendarClock, RotateCcw, ShieldCheck, Tag, Truck } from "lucide-react";
import type { CSSProperties } from "react";
import { boutique } from "@/config/boutique";
import { annoncesCodesPromo } from "@/lib/offres";
import { formatPrixCourt } from "@/lib/prix";

// Uniquement des offres que la boutique applique vraiment : une ligne ajoutée ici apparaît partout.
const permanents = [
  {
    icone: Truck,
    texte: `Livraison offerte dès ${formatPrixCourt(boutique.livraison.seuilGratuitCentimes)}`,
  },
  { icone: RotateCcw, texte: `Retours gratuits sous ${boutique.retours.joursRetractation} jours` },
  { icone: CalendarClock, texte: "Paiement en 3 ou 4 fois avec Klarna" },
  { icone: ShieldCheck, texte: `Garantie ${boutique.garantieMois / 12} ans` },
  { icone: Award, texte: "Authenticité garantie" },
];

type Message = (typeof permanents)[number];

function Messages({ messages, copie = false }: { messages: Message[]; copie?: boolean }) {
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
 * Les codes promo cochés « banderole » au back-office passent en tête.
 */
export async function Banderole() {
  const messages = [
    ...(await annoncesCodesPromo()).map((texte) => ({ icone: Tag, texte })),
    ...permanents,
  ];
  // Chaque message garde le même temps à l'écran, quel que soit le nombre de codes annoncés.
  const duree = `calc(var(--duree-banderole) * ${messages.length} / ${permanents.length})`;
  return (
    <div
      role="region"
      aria-label="Offres de la boutique"
      className="flex border-b border-filet bg-blanc"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          className="banderole-continue flex w-max animate-banderole"
          style={{ animationDuration: duree, "--duree-rouleau": duree } as CSSProperties}
        >
          <Messages messages={messages} />
          <Messages messages={messages} copie />
        </div>
      </div>
    </div>
  );
}
