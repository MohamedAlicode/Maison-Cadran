"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

/** Suppression en deux temps : le premier clic demande confirmation, le second supprime. */
export function BoutonSupprimer({
  supprimer,
  libelle,
  confirmation,
}: {
  supprimer: () => Promise<{ ok: boolean; message: string } | void>;
  libelle: string;
  confirmation: string;
}) {
  const [aConfirmer, setAConfirmer] = useState(false);
  const [message, setMessage] = useState("");
  const [enCours, demarrer] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-4">
      {aConfirmer ? (
        <>
          <span className="text-sm">{confirmation}</span>
          <Button
            variante="secondaire"
            taille="sm"
            disabled={enCours}
            onClick={() =>
              demarrer(async () => {
                const retour = await supprimer();
                if (retour && !retour.ok) setMessage(retour.message);
                setAConfirmer(false);
              })
            }
          >
            Oui, supprimer
          </Button>
          <Button variante="fantome" taille="sm" onClick={() => setAConfirmer(false)}>
            Annuler
          </Button>
        </>
      ) : (
        <Button
          variante="fantome"
          taille="sm"
          className="text-bordeaux"
          onClick={() => setAConfirmer(true)}
        >
          {libelle}
        </Button>
      )}
      <p role="status" className="text-sm text-bordeaux empty:hidden">
        {message}
      </p>
    </div>
  );
}
