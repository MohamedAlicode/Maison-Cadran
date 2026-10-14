"use client";

import { Lock } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { passerCommande } from "@/server/actions/commande";

/** Bouton « Commander » : crée la commande côté serveur puis redirige vers Stripe Checkout. */
export function FormulaireCommander() {
  const [etat, action, enCours] = useActionState(passerCommande, null);
  return (
    <form action={action}>
      <Button type="submit" pleineLargeur taille="lg" disabled={enCours}>
        <Lock aria-hidden className="size-4" strokeWidth={1.5} />
        {enCours ? "Redirection vers le paiement…" : "Commander"}
      </Button>
      <p role="status" className="mt-3 text-sm text-bordeaux empty:hidden">
        {etat?.message}
      </p>
    </form>
  );
}
