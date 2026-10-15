"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

// Ouverture du mini-panier, partagée entre l'icône de l'en-tête et les boutons « Ajouter au panier ».
type EtatMiniPanier = {
  ouvert: boolean;
  changerOuverture: (ouvert: boolean) => void;
  /** Ouvre le tiroir en retenant le bouton à qui rendre le focus à la fermeture. */
  ouvrirDepuis: (declencheur: HTMLElement) => void;
  /** À brancher sur `onCloseAutoFocus` : sans lui, Radix rendrait le focus à l'icône de l'en-tête. */
  rendreFocus: (evenement: Event) => void;
};

const Contexte = createContext<EtatMiniPanier | null>(null);

export function EtatMiniPanierProvider({ children }: { children: ReactNode }) {
  const [ouvert, changerOuverture] = useState(false);
  const declencheur = useRef<HTMLElement | null>(null);

  function ouvrirDepuis(element: HTMLElement) {
    declencheur.current = element;
    changerOuverture(true);
  }

  function rendreFocus(evenement: Event) {
    if (!declencheur.current) return;
    evenement.preventDefault();
    declencheur.current.focus();
    declencheur.current = null;
  }

  return (
    <Contexte value={{ ouvert, changerOuverture, ouvrirDepuis, rendreFocus }}>{children}</Contexte>
  );
}

export function useMiniPanier() {
  const etat = useContext(Contexte);
  if (!etat) throw new Error("useMiniPanier doit être utilisé sous EtatMiniPanierProvider.");
  return etat;
}
