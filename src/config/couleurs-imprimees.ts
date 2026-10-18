// Les e-mails et les factures PDF ne savent pas lire les variables CSS : ils reçoivent ici
// une copie des tokens de src/app/globals.css. À mettre à jour si la palette change.
export const couleursImprimees = {
  acier: "#f1f1ee",
  blanc: "#ffffff",
  nuit: "#111b29",
  encre: "#15191c",
  graphite: "#555c61",
  filet: "#d9dad6",
  cadran: "#1f3a5f",
  cadranClair: "#a9bedb",
} as const;
