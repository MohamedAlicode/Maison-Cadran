"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { demanderLien } from "@/server/actions/compte";

/** Demande d'un lien magique : une seule saisie, l'adresse e-mail. */
export function FormulaireConnexion({ retour }: { retour: string }) {
  const [etat, action, enCours] = useActionState(demanderLien, null);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="retour" value={retour} />
      <Field
        id="connexion-email"
        name="email"
        type="email"
        label="Adresse e-mail"
        autoComplete="email"
        required
        defaultValue={etat?.email}
        aide="Nous vous envoyons un lien de connexion, valable 24 heures."
        erreur={etat?.message}
      />
      {/* Même choix que « Commander » : aria-disabled garde le focus sur le bouton. */}
      <Button
        type="submit"
        taille="lg"
        pleineLargeur
        aria-disabled={enCours}
        onClick={(evenement) => enCours && evenement.preventDefault()}
      >
        {enCours ? "Envoi du lien…" : "Recevoir mon lien de connexion"}
      </Button>
    </form>
  );
}
