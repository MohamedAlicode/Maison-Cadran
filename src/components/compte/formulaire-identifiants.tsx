"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { connecterAvecMotDePasse, inscrire } from "@/server/actions/compte";

const modes = {
  connexion: {
    action: connecterAvecMotDePasse,
    autoComplete: "current-password",
    aide: undefined,
    bouton: "Se connecter",
    enCours: "Connexion…",
  },
  inscription: {
    action: inscrire,
    autoComplete: "new-password",
    aide: "8 caractères au minimum. Une phrase courte est plus sûre qu'un mot compliqué.",
    bouton: "Créer mon compte",
    enCours: "Création du compte…",
  },
} as const;

/** Adresse e-mail et mot de passe, pour se connecter ou créer un compte. */
export function FormulaireIdentifiants({
  mode,
  retour,
}: {
  mode: keyof typeof modes;
  retour: string;
}) {
  const reglages = modes[mode];
  const [etat, action, enCours] = useActionState(reglages.action, null);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="retour" value={retour} />
      {etat?.erreurs.formulaire && (
        <p role="alert" className="text-sm text-bordeaux">
          {etat.erreurs.formulaire}
        </p>
      )}
      <Field
        id={`${mode}-email`}
        name="email"
        type="email"
        label="Adresse e-mail"
        autoComplete="email"
        required
        defaultValue={etat?.email}
        erreur={etat?.erreurs.email}
      />
      <Field
        id={`${mode}-mot-de-passe`}
        name="motDePasse"
        type="password"
        label="Mot de passe"
        autoComplete={reglages.autoComplete}
        required
        minLength={mode === "inscription" ? 8 : undefined}
        maxLength={128}
        aide={reglages.aide}
        erreur={etat?.erreurs.motDePasse}
      />
      {/* Même choix que « Commander » : aria-disabled garde le focus sur le bouton. */}
      <Button
        type="submit"
        taille="lg"
        pleineLargeur
        aria-disabled={enCours}
        onClick={(evenement) => enCours && evenement.preventDefault()}
      >
        {enCours ? reglages.enCours : reglages.bouton}
      </Button>
    </form>
  );
}
