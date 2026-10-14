"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Le retour de Stripe arrive parfois avant le webhook qui confirme le paiement :
 * la page se recharge alors quelques fois, le temps que la commande passe en « payée ».
 */
export function ActualisationAttente({ essais = 15, intervalleMs = 2000 }) {
  const routeur = useRouter();
  useEffect(() => {
    let restants = essais;
    const minuteur = setInterval(() => {
      restants -= 1;
      if (restants <= 0) clearInterval(minuteur);
      routeur.refresh();
    }, intervalleMs);
    return () => clearInterval(minuteur);
  }, [routeur, essais, intervalleMs]);
  return null;
}
