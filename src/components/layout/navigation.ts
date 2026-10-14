// Entrées du menu principal, partagées entre le header desktop et le menu mobile.
export const navigationPrincipale = [
  { libelle: "Montres", href: "/montres" },
  { libelle: "Homme", href: "/montres?genre=homme" },
  { libelle: "Femme", href: "/montres?genre=femme" },
  { libelle: "Marques", href: "/marques" },
  { libelle: "Guide d'achat", href: "/guide" },
] as const;
