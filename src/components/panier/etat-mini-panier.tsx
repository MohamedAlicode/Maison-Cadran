"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Ouverture du mini-panier, partagée entre l'icône de l'en-tête et les boutons « Ajouter au panier ».
type EtatMiniPanier = { ouvert: boolean; changerOuverture: (ouvert: boolean) => void };

const Contexte = createContext<EtatMiniPanier | null>(null);

export function EtatMiniPanierProvider({ children }: { children: ReactNode }) {
  const [ouvert, changerOuverture] = useState(false);
  return <Contexte value={{ ouvert, changerOuverture }}>{children}</Contexte>;
}

export function useMiniPanier() {
  const etat = useContext(Contexte);
  if (!etat) throw new Error("useMiniPanier doit être utilisé sous EtatMiniPanierProvider.");
  return etat;
}
