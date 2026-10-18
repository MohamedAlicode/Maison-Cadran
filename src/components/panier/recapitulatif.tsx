import { CalendarClock, Lock, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { boutique } from "@/config/boutique";
import type { MontantsPanier } from "@/lib/panier/regles";
import { formatPrix, formatPrixCourt } from "@/lib/prix";

/** Progression vers la livraison offerte, rappelée dans le tiroir et sur la page panier. */
export function ProgressionLivraison({ montants }: { montants: MontantsPanier }) {
  const reste = montants.resteAvantLivraisonOfferteCentimes;
  return (
    <div>
      <p className="text-sm">
        {reste > 0 ? (
          <>
            Plus que <strong className="chiffres font-medium">{formatPrixCourt(reste)}</strong> pour
            la livraison offerte.
          </>
        ) : (
          "Votre livraison assurée est offerte."
        )}
      </p>
      {/* Une fois le seuil atteint, la jauge pleine ne dirait plus rien : seule la phrase reste. */}
      {reste > 0 && (
        <Progress
          className="mt-3"
          valeur={montants.sousTotalCentimes - montants.remiseCentimes}
          max={boutique.livraison.seuilGratuitCentimes}
          label="Progression vers la livraison offerte"
        />
      )}
    </div>
  );
}

/** Sous-total, livraison et total TTC. */
export function Montants({ montants }: { montants: MontantsPanier }) {
  return (
    <div className="chiffres space-y-3 text-sm">
      <dl className="space-y-3">
        <div className="flex justify-between gap-4">
          <dt>Sous-total</dt>
          <dd>{formatPrix(montants.sousTotalCentimes)}</dd>
        </div>
        {montants.remiseCentimes > 0 && (
          <div className="flex justify-between gap-4">
            <dt>Remise</dt>
            <dd>−{formatPrix(montants.remiseCentimes)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>
            Livraison
            <span className="block text-xs text-graphite">{boutique.livraison.transporteur}</span>
          </dt>
          <dd>
            {montants.livraisonCentimes === 0 ? "Offerte" : formatPrix(montants.livraisonCentimes)}
          </dd>
        </div>
        {/* Annoncé par les lecteurs d'écran quand une quantité change ou qu'une montre est retirée. */}
        <div
          aria-live="polite"
          aria-atomic
          className="flex justify-between gap-4 border-t border-filet pt-3 text-base font-medium"
        >
          <dt>Total</dt>
          <dd>{formatPrix(montants.totalCentimes)}</dd>
        </div>
      </dl>
      <p className="text-xs text-graphite">TTC, dont TVA {formatPrix(montants.tvaCentimes)}</p>
    </div>
  );
}

/** Rappels rassurants posés sous le bouton de paiement. */
export function ReassurancePaiement({ children }: { children?: ReactNode }) {
  const rappels = [
    { icone: Lock, texte: "Paiement sécurisé par Stripe" },
    { icone: CalendarClock, texte: "Paiement en 3 ou 4 fois avec Klarna" },
    {
      icone: RotateCcw,
      texte: `Retours gratuits sous ${boutique.retours.joursRetractation} jours`,
    },
  ];
  return (
    <ul className="space-y-2 text-xs text-graphite">
      {rappels.map(({ icone: Icone, texte }) => (
        <li key={texte} className="flex items-center gap-2">
          <Icone aria-hidden className="size-4 shrink-0 text-cadran" strokeWidth={1.5} />
          {texte}
        </li>
      ))}
      {children}
    </ul>
  );
}
