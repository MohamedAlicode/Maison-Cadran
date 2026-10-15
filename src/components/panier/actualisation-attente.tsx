"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { boutique } from "@/config/boutique";

/**
 * Le retour de Stripe arrive parfois avant le webhook qui confirme le paiement :
 * la page se recharge alors quelques fois, le temps que la commande passe en « payée ».
 */
export function ActualisationAttente({ essais = 15, intervalleMs = 2000 }) {
  const routeur = useRouter();
  const [epuise, changerEpuise] = useState(false);
  useEffect(() => {
    let restants = essais;
    const minuteur = setInterval(() => {
      restants -= 1;
      if (restants <= 0) {
        clearInterval(minuteur);
        changerEpuise(true);
      }
      routeur.refresh();
    }, intervalleMs);
    return () => clearInterval(minuteur);
  }, [routeur, essais, intervalleMs]);

  if (!epuise) {
    return (
      <p className="mt-4 leading-relaxed text-graphite">
        Votre banque nous répond. Cette page se met à jour toute seule dans quelques secondes.
      </p>
    );
  }
  // Au-delà, la page ne se recharge plus seule : on le dit, plutôt que de laisser attendre.
  return (
    <p className="mt-4 leading-relaxed text-graphite">
      La confirmation prend plus de temps que prévu. Votre paiement est en sécurité : vous recevrez
      l&apos;e-mail de confirmation dès sa validation. Vous pouvez{" "}
      <button
        type="button"
        onClick={() => routeur.refresh()}
        className="text-encre underline decoration-filet-fort underline-offset-4 hover:text-cadran"
      >
        actualiser la page
      </button>{" "}
      ou nous écrire à{" "}
      <a
        href={`mailto:${boutique.contact.email}`}
        className="text-encre underline decoration-filet-fort underline-offset-4 hover:text-cadran"
      >
        {boutique.contact.email}
      </a>
      .
    </p>
  );
}
