"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Price } from "@/components/ui/price";
import type { LignePanier as Ligne } from "@/lib/panier/serveur";
import { formatPrixCourt } from "@/lib/prix";
import { cn } from "@/lib/utils";
import { changerQuantite, retirerDuPanier } from "@/server/actions/panier";

/** Une montre du panier : photo, marque et modèle, quantité, prix. Sert au tiroir et à la page. */
export function LignePanier({ ligne, compacte = false }: { ligne: Ligne; compacte?: boolean }) {
  const [enCours, demarrer] = useTransition();
  const [erreur, changerErreur] = useState<string | null>(null);
  const idQuantite = useId();
  const refLigne = useRef<HTMLLIElement>(null);
  const focusApresRetrait = useRef<HTMLElement | null>(null);

  // La ligne retirée disparaît avec le bouton qui avait le focus : on le confie à la ligne
  // voisine, sinon au tiroir ou au titre de la page, au lieu de le renvoyer en haut du document.
  useEffect(() => () => focusApresRetrait.current?.focus(), []);

  // Pendant une mise à jour, les contrôles restent actifs (aria-disabled) : un contrôle
  // désactivé perd le focus, et un utilisateur au clavier se retrouverait en haut de la page.
  function executer(action: () => Promise<{ ok: true } | { ok: false; message: string }>) {
    if (enCours) return;
    changerErreur(null);
    demarrer(async () => {
      const resultat = await action();
      if (!resultat.ok) {
        focusApresRetrait.current = null;
        changerErreur(resultat.message);
      }
    });
  }

  function retirer() {
    const li = refLigne.current;
    const voisine = li?.nextElementSibling ?? li?.previousElementSibling;
    focusApresRetrait.current =
      voisine?.querySelector<HTMLElement>("select, button") ??
      li?.closest<HTMLElement>("[role=dialog]") ??
      document.getElementById("titre-panier");
    executer(() => retirerDuPanier(ligne.id));
  }

  return (
    <li
      ref={refLigne}
      aria-busy={enCours}
      className={cn(
        "flex gap-4 transition-opacity duration-(--duree-courte) ease-maison",
        enCours && "opacity-60",
      )}
    >
      <Link
        href={`/montres/${ligne.slug}`}
        tabIndex={-1}
        aria-hidden
        className={cn(
          "relative shrink-0 overflow-hidden rounded-controle bg-blanc",
          compacte ? "size-20" : "size-24 md:size-32",
        )}
      >
        {ligne.image && (
          <Image
            src={ligne.image.url}
            alt=""
            fill
            sizes={compacte ? "80px" : "128px"}
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-serif leading-snug", compacte ? "text-lg" : "text-xl")}>
            <Link href={`/montres/${ligne.slug}`} className="hover:text-cadran">
              <span className="text-graphite">{ligne.marque}</span> {ligne.nom}
            </Link>
          </h3>
          <Price centimes={ligne.prixCentimes * ligne.quantite} className="shrink-0 text-base" />
        </div>
        <p className="chiffres mt-0.5 text-sm text-graphite">
          Réf. {ligne.reference}
          {ligne.quantite > 1 && ` · ${formatPrixCourt(ligne.prixCentimes)} l'unité`}
        </p>
        {ligne.ajustee && (
          <p className="mt-1 text-sm text-ambre">Quantité réduite au stock disponible.</p>
        )}

        <div className="mt-auto flex items-center gap-4 pt-3 text-sm">
          {ligne.quantiteMax > 1 ? (
            <div className="flex items-center gap-2">
              <label htmlFor={idQuantite} className="text-graphite">
                Quantité<span className="sr-only"> {`${ligne.marque} ${ligne.nom}`}</span>
              </label>
              <select
                id={idQuantite}
                value={ligne.quantite}
                aria-disabled={enCours}
                onChange={(e) => executer(() => changerQuantite(ligne.id, Number(e.target.value)))}
                className="chiffres h-11 rounded-full border border-filet-fort bg-blanc px-4 text-base"
              >
                {Array.from({ length: ligne.quantiteMax }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-graphite">Quantité : 1</p>
          )}
          <button
            type="button"
            aria-disabled={enCours}
            onClick={retirer}
            className="inline-flex h-11 items-center text-graphite underline decoration-filet-fort underline-offset-4 hover:text-encre"
          >
            Retirer<span className="sr-only"> {`${ligne.marque} ${ligne.nom}`}</span>
          </button>
        </div>
        <p aria-live="polite" className="text-sm text-bordeaux empty:hidden">
          {erreur}
        </p>
      </div>
    </li>
  );
}
