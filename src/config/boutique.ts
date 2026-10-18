// Paramètres de la boutique, centralisés ici pour être modifiés en une ligne.
// Les valeurs marquées « provisoire » attendent une décision définitive.

export const boutique = {
  nom: "Maison Cadran", // provisoire
  slogan: "Horlogerie de caractère, choisie avec soin",
  pays: "FR",
  devise: "EUR",
  locale: "fr-FR",

  /** Taux de TVA en points de base (2000 = 20 %). */
  tauxTvaPb: 2000,

  livraison: {
    /** Seuil de livraison offerte, en centimes (provisoire : 150 €). */
    seuilGratuitCentimes: 15_000,
    /** Frais en dessous du seuil, en centimes. */
    fraisCentimes: 990,
    transporteur: "Colissimo, remise contre signature",
    delaiLivraison: "48 h après expédition",
  },

  retours: {
    joursRetractation: 14,
  },

  garantieMois: 24,

  contact: {
    email: "contact@maison-cadran.fr", // provisoire
    telephone: "01 00 00 00 00", // provisoire
    horaires: "du lundi au vendredi, de 10 h à 18 h",
  },

  /** Projet de démonstration (portfolio) : aucune société n'existe, ces champs restent fictifs. */
  societe: {
    raisonSociale: "[fictif]",
    formeJuridique: "[fictif]",
    capital: "[fictif]",
    siege: "[fictif]",
    rcs: "[fictif]",
    siret: "[fictif]",
    tvaIntracom: "[fictif]",
    directeurPublication: "[fictif]",
    hebergeur: "[fictif]",
    mediateur: "[fictif]",
  },
} as const;

export type ConfigBoutique = typeof boutique;
