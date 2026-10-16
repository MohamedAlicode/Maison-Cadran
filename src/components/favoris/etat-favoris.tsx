"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { basculerFavori } from "@/server/actions/compte";

type EtatFavoris = {
  estFavori: (produitId: string) => boolean;
  basculer: (produitId: string) => Promise<void>;
  /** À appeler à la déconnexion : les cœurs se vident sans recharger la page. */
  oublier: () => void;
};

const Contexte = createContext<EtatFavoris | null>(null);

/** Les favoris sont chargés une fois par visite, puis tenus à jour à chaque clic. */
export function EtatFavorisProvider({ children }: { children: ReactNode }) {
  const [ids, changerIds] = useState<Set<string>>(new Set());
  const routeur = useRouter();

  useEffect(() => {
    fetch("/api/favoris", { cache: "no-store" })
      .then((reponse) => reponse.json() as Promise<{ ids: string[] }>)
      .then((donnees) => changerIds(new Set(donnees.ids)))
      .catch(() => {});
  }, []);

  async function basculer(produitId: string) {
    const avant = ids;
    const apres = new Set(ids);
    if (apres.has(produitId)) apres.delete(produitId);
    else apres.add(produitId);
    changerIds(apres);

    const resultat = await basculerFavori(produitId).catch(() => null);
    const chemin = window.location.pathname;
    if (!resultat?.ok) {
      changerIds(avant);
      // Sans compte, le favori n'a nulle part où être gardé : on propose de se connecter.
      if (resultat && !resultat.connecte) {
        routeur.push(`/connexion?retour=${encodeURIComponent(chemin)}`);
      }
      return;
    }
    if (chemin.startsWith("/compte")) routeur.refresh();
  }

  return (
    <Contexte
      value={{ estFavori: (id) => ids.has(id), basculer, oublier: () => changerIds(new Set()) }}
    >
      {children}
    </Contexte>
  );
}

export function useFavoris() {
  const etat = useContext(Contexte);
  if (!etat) throw new Error("useFavoris doit être utilisé sous EtatFavorisProvider.");
  return etat;
}
