// Jeu de données de test : 8 marques, 19 montres réalistes, 3 collections, quelques avis.
// Chaque fiche décrit la montre de sa photo libre de droits (voir src/lib/photos-montres.ts) ;
// les caractéristiques suivent les fiches des fabricants et les prix sont indicatifs (TTC).

import type { CaseMaterial, Gender, Movement, StrapType } from "../src/generated/prisma/enums";

export type MarqueTest = {
  slug: string;
  name: string;
  country: string;
  foundedYear: number;
  description: string;
  history: string;
};

export type MontreTest = {
  slug: string;
  marque: string;
  name: string;
  reference: string;
  familyKey?: string;
  shortDescription: string;
  description: string;
  editorialNote?: string;
  priceCents: number;
  compareAtCents?: number;
  stock: number;
  leadTimeDays?: number;
  gender: Gender;
  movement: Movement;
  caliber?: string;
  powerReserveH?: number;
  caseDiameterMm: number;
  caseThicknessMm?: number;
  lugWidthMm?: number;
  caseMaterial: CaseMaterial;
  strapType: StrapType;
  strapColor?: string;
  dialColor: string;
  waterResistanceM: number;
  crystal: string;
  functions: string[];
  collections?: string[];
  /** Jours écoulés depuis la mise en ligne (pour le tri « nouveautés »). */
  ancienneteJours: number;
};

export const marques: MarqueTest[] = [
  {
    slug: "tissot",
    name: "Tissot",
    country: "Suisse",
    foundedYear: 1853,
    description:
      "Fondée au Locle, Tissot rend l'horlogerie suisse accessible avec des mouvements automatiques à longue réserve de marche.",
    history:
      "Installée au Locle depuis 1853, Tissot a été l'une des premières maisons à produire des montres de poche en série, puis des montres-bracelets antimagnétiques. Aujourd'hui, son calibre Powermatic 80 offre 80 heures de réserve de marche à un prix rare pour un mouvement suisse.",
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    country: "Suisse / États-Unis",
    foundedYear: 1892,
    description:
      "Née en Pennsylvanie, fabriquée en Suisse : des montres militaires et aviation à l'esprit américain.",
    history:
      "Hamilton a équipé les soldats américains pendant les deux guerres mondiales et les pilotes de l'aviation civile naissante. La Khaki Field reprend directement les codes des montres de terrain de 1940, avec un calibre H-50 de 80 heures.",
  },
  {
    slug: "seiko",
    name: "Seiko",
    country: "Japon",
    foundedYear: 1881,
    description:
      "Manufacture japonaise intégrée, Seiko fabrique tout elle-même, du spiral au cadran.",
    history:
      "Pionnière du quartz en 1969 avec l'Astron, Seiko produit aussi des mouvements mécaniques robustes. Les collections Presage et Prospex célèbrent l'artisanat japonais et l'exploration.",
  },
  {
    slug: "citizen",
    name: "Citizen",
    country: "Japon",
    foundedYear: 1918,
    description:
      "Inventeur de la technologie Eco-Drive : des montres rechargées par toute source de lumière, sans pile à changer.",
    history:
      "Citizen a lancé l'Eco-Drive en 1976. Ses montres solaires fonctionnent des mois dans l'obscurité une fois chargées. La Navihawk y ajoute le chronographe d'aviateur et la remise à l'heure par signal radio.",
  },
  {
    slug: "orient",
    name: "Orient",
    country: "Japon",
    foundedYear: 1950,
    description:
      "Des automatiques de manufacture à des prix imbattables, référence des premiers achats mécaniques.",
    history:
      "Orient fabrique ses propres mouvements automatiques depuis plus de soixante ans. La Bambino est devenue la montre habillée de référence sous 250 €, et la Mako une plongeuse appréciée des collectionneurs.",
  },
  {
    slug: "certina",
    name: "Certina",
    country: "Suisse",
    foundedYear: 1888,
    description:
      "Le concept « Double Sécurité » (DS) : des montres suisses conçues pour résister aux chocs.",
    history:
      "Depuis 1959, le système DS protège le mouvement et renforce l'étanchéité. La collection DS Action en est l'héritière directe, étanche à 200 mètres.",
  },
  {
    slug: "mido",
    name: "Mido",
    country: "Suisse",
    foundedYear: 1918,
    description:
      "Des montres inspirées de l'architecture, avec des mouvements certifiés et 80 heures d'autonomie.",
    history:
      "Mido puise son inspiration dans les grands monuments. L'Ocean Star, lancée en 1944, est l'une des premières montres de plongée étanches produites en série.",
  },
  {
    slug: "frederique-constant",
    name: "Frederique Constant",
    country: "Suisse",
    foundedYear: 1988,
    description:
      "Le luxe genevois accessible : des montres classiques et élégantes, aux finitions soignées.",
    history:
      "Fondée à Genève en 1988, Frederique Constant s'est donné pour mission de rendre accessible l'horlogerie de luxe suisse. Ses éditions Vintage Rally rendent hommage aux voitures de course anglaises des années 50.",
  },
];

export const collections = [
  {
    slug: "montres-de-plongee",
    name: "Montres de plongée",
    description:
      "Étanches à 200 mètres ou plus, lunette tournante et index luminescents : des montres conçues pour l'eau, portées partout.",
    isFeatured: true,
  },
  {
    slug: "montres-habillees",
    name: "Montres habillées",
    description:
      "Boîtiers fins, cadrans épurés et bracelets en cuir : l'élégance pour le bureau et les grandes occasions.",
    isFeatured: true,
  },
  {
    slug: "idees-cadeaux-moins-de-500-euros",
    name: "Idées cadeaux à moins de 500 €",
    description:
      "Une belle montre pour offrir, sans se tromper : notre sélection de modèles à moins de 500 €.",
    isFeatured: true,
  },
];

export const montres: MontreTest[] = [
  {
    slug: "tissot-prx-40mm-quartz-argente",
    marque: "tissot",
    name: "PRX 40 mm",
    reference: "T137.410.11.031.00",
    shortDescription: "L'icône des années 70 au bracelet intégré, en quartz et cadran argenté.",
    description:
      "La PRX reprend le dessin d'un modèle Tissot de 1978 : boîtier en tonneau, bracelet intégré et finitions alternant poli et satiné. Son cadran argenté, rehaussé d'aiguilles et d'index dorés rose, se lit d'un coup d'œil sous un verre saphir. Le mouvement quartz suisse se fait oublier : précis, sans remontage, avec une pile qui dure plusieurs années.",
    editorialNote:
      "Notre meilleure vente, et pour cause : tout le style de la PRX au prix le plus doux de la gamme. Le bracelet se règle facilement et le confort surprend pour une montre en acier.",
    priceCents: 37_500,
    stock: 6,
    gender: "HOMME",
    movement: "QUARTZ",
    caliber: "ETA F06.115",
    caseDiameterMm: 40,
    caseThicknessMm: 10.4,
    lugWidthMm: 12,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "argente",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 5,
  },
  {
    slug: "tissot-le-locle-automatique-blanc",
    marque: "tissot",
    name: "Le Locle Automatique",
    reference: "T41.1.423.33",
    shortDescription:
      "Chiffres romains et cadran guilloché : l'hommage de Tissot à sa ville natale.",
    description:
      "Baptisée du nom de la ville où Tissot est née en 1853, la Le Locle réunit tous les codes de la montre habillée suisse : cadran blanc au centre guilloché, chiffres romains, guichet de date à 3 heures et bracelet en cuir noir. Son mouvement automatique se remonte au fil des gestes du poignet.",
    priceCents: 59_500,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "ETA 2824-2",
    powerReserveH: 38,
    caseDiameterMm: 39.3,
    caseThicknessMm: 9.8,
    lugWidthMm: 19,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "noir",
    dialColor: "blanc",
    waterResistanceM: 30,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees"],
    ancienneteJours: 12,
  },
  {
    slug: "tissot-prx-powermatic-80-35mm-noir",
    marque: "tissot",
    name: "PRX Powermatic 80 35 mm",
    reference: "T137.207.11.051.00",
    shortDescription: "La PRX automatique en 35 mm, cadran noir à motif gaufré.",
    description:
      "La version 35 mm de la PRX garde toute l'allure de l'originale dans un format plus délicat, qui convient à tous les poignets. Son cadran noir à motif « clous de Paris » capte la lumière, et le mouvement Powermatic 80 offre 80 heures de réserve de marche : retirée le vendredi soir, elle tourne encore le lundi matin.",
    priceCents: 65_000,
    stock: 8,
    gender: "MIXTE",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111",
    powerReserveH: 80,
    caseDiameterMm: 35,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    ancienneteJours: 30,
  },
  {
    slug: "tissot-luxury-powermatic-80-argente",
    marque: "tissot",
    name: "Luxury Powermatic 80",
    reference: "T086.407.16.031.00",
    shortDescription: "La montre habillée automatique, cadran argenté soleillé et cuir marron.",
    description:
      "La Luxury passe du costume au week-end sans effort. Son cadran argenté joue sur deux finitions, soleillée au centre et satinée sur le pourtour, sous un verre saphir. Le mouvement Powermatic 80 offre 80 heures de réserve de marche, et le bracelet en cuir marron se patine avec le temps.",
    priceCents: 65_000,
    stock: 4,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111",
    powerReserveH: 80,
    caseDiameterMm: 41,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "argente",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees"],
    ancienneteJours: 60,
  },
  {
    slug: "hamilton-khaki-field-mechanical-38mm-noir",
    marque: "hamilton",
    name: "Khaki Field Mechanical",
    reference: "H69439931",
    shortDescription: "La montre de terrain militaire, à remontage manuel, telle qu'en 1940.",
    description:
      "Fidèle aux montres fournies à l'armée américaine, la Khaki Field Mechanical se remonte à la main chaque matin, un petit rituel apprécié des amateurs. Son cadran noir très lisible, ses chiffres arabes et son boîtier de 38 mm en font une montre polyvalente et intemporelle.",
    editorialNote:
      "Notre conseil pour une première montre mécanique : discrète, robuste et chargée d'histoire. Le bracelet NATO se change en quelques secondes.",
    priceCents: 59_500,
    stock: 5,
    gender: "MIXTE",
    movement: "MANUEL",
    caliber: "H-50",
    powerReserveH: 80,
    caseDiameterMm: 38,
    caseThicknessMm: 9.5,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "NATO_TISSU",
    strapColor: "kaki",
    dialColor: "noir",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes"],
    ancienneteJours: 3,
  },
  {
    slug: "hamilton-khaki-field-officer-auto-44mm-noir",
    marque: "hamilton",
    name: "Khaki Field Officer Auto",
    reference: "H70615133",
    shortDescription: "L'esprit militaire en version automatique, sur bracelet acier.",
    description:
      "Plus grande et automatique, la Khaki Field Officer garde la lisibilité des montres de terrain : grands chiffres, aiguilles luminescentes, échelle des 24 heures. Son boîtier de 44 mm et son bracelet en acier en font une montre robuste, faite pour être portée tous les jours.",
    priceCents: 79_500,
    stock: 3,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "ETA 2824-2",
    powerReserveH: 38,
    caseDiameterMm: 44,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    ancienneteJours: 20,
  },
  {
    slug: "hamilton-jazzmaster-maestro-auto-chrono-blanc",
    marque: "hamilton",
    name: "Jazzmaster Maestro Auto Chrono",
    reference: "H32766513",
    shortDescription: "Un chronographe automatique habillé, cadran blanc et chiffres dorés rose.",
    description:
      "La Jazzmaster Maestro réunit un chronographe automatique et un double guichet jour et date dans un boîtier poli. Son cadran blanc, ses chiffres arabes dorés rose et son bracelet en cuir façon alligator lui donnent l'élégance d'une montre de soirée, avec la mécanique d'une montre de sport.",
    priceCents: 179_500,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "H-21",
    powerReserveH: 60,
    caseDiameterMm: 45,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "blanc",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Chronographe", "Date", "Jour"],
    collections: ["montres-habillees"],
    ancienneteJours: 45,
  },
  {
    slug: "seiko-presage-cocktail-time-sarb065-bleu",
    marque: "seiko",
    name: "Presage Cocktail Time",
    reference: "SARB065",
    shortDescription: "Le cadran bleu glacier qui a lancé la série Cocktail Time.",
    description:
      "La série Cocktail Time est née d'une collaboration avec un barman de Tokyo. Ce premier modèle a un cadran bleu glacier à reflets rayonnants, des aiguilles dauphine et des index facettés. Mouvement automatique 4R35 de manufacture et fond transparent. Elle est présentée ici sur un bracelet NATO bleu, qui se change en quelques secondes.",
    editorialNote:
      "Le cadran est encore plus beau en vrai qu'en photo. Un excellent choix pour offrir.",
    priceCents: 49_000,
    stock: 5,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "4R35",
    powerReserveH: 41,
    caseDiameterMm: 40.5,
    caseThicknessMm: 11.8,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "NATO_TISSU",
    strapColor: "bleu",
    dialColor: "bleu",
    waterResistanceM: 50,
    crystal: "Hardlex",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 8,
  },
  {
    slug: "seiko-5-sports-snzh53-bleu",
    marque: "seiko",
    name: "5 Sports",
    reference: "SNZH53K1",
    shortDescription: "La plongeuse automatique au cadran bleu, pour débuter en mécanique.",
    description:
      "Lunette tournante bleue, cadran bleu dégradé et guichet jour et date : la Seiko 5 Sports a l'allure des plongeuses des années 50. Son mouvement automatique 7S36 a fait ses preuves sur des millions de montres. Robuste, fiable, et un prix qui en fait la montre automatique d'entrée idéale.",
    priceCents: 28_900,
    stock: 7,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "7S36",
    powerReserveH: 41,
    caseDiameterMm: 42,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 100,
    crystal: "Hardlex",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Lunette tournante"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 18,
  },
  {
    slug: "seiko-prospex-alpinist-titane-noir",
    marque: "seiko",
    name: "Prospex Alpinist Titane",
    reference: "8F56-00D0",
    shortDescription: "L'Alpinist en titane, avec calendrier perpétuel et second fuseau horaire.",
    description:
      "Créée pour les montagnards, l'Alpinist se décline ici en titane, plus léger que l'acier. Son mouvement quartz 8F56 tient compte des mois courts et des années bissextiles jusqu'en 2100, et une aiguille des 24 heures affiche un second fuseau horaire. Lunette tournante graduée, verre saphir.",
    priceCents: 69_000,
    stock: 2,
    gender: "HOMME",
    movement: "QUARTZ",
    caliber: "8F56",
    caseDiameterMm: 40,
    caseMaterial: "TITANE",
    strapType: "TITANE",
    dialColor: "noir",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: [
      "Heures, minutes, secondes",
      "Date",
      "Calendrier perpétuel",
      "Second fuseau horaire",
    ],
    ancienneteJours: 75,
  },
  {
    slug: "seiko-dame-quartz-saphir-blanc",
    marque: "seiko",
    name: "Classique Dame Saphir",
    reference: "SJW041P1",
    shortDescription: "Une montre féminine en acier, cadran blanc et guichet jour et date.",
    description:
      "Boîtier fin, cadran blanc nacré et bracelet en acier : une montre de tous les jours qui se porte aussi bien au bureau qu'en soirée. Son mouvement quartz japonais et son verre saphir inrayable la rendent sans souci, et elle résiste à 100 mètres.",
    priceCents: 17_900,
    stock: 6,
    gender: "FEMME",
    movement: "QUARTZ",
    caseDiameterMm: 28,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "blanc",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Jour"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 50,
  },
  {
    slug: "citizen-navihawk-a-t-noir",
    marque: "citizen",
    name: "Navihawk A-T",
    reference: "JY8034-58E",
    shortDescription:
      "Le chronographe d'aviateur solaire et radio-piloté, règle à calcul comprise.",
    description:
      "Inspirée des instruments de bord, la Navihawk réunit un chronographe, une règle à calcul sur la lunette et l'heure de 43 villes. Elle se recharge à la lumière grâce à l'Eco-Drive et se remet à l'heure seule par signal radio. Boîtier bicolore et bracelet en acier.",
    priceCents: 54_900,
    compareAtCents: 59_900,
    stock: 3,
    gender: "HOMME",
    movement: "SOLAIRE",
    caseDiameterMm: 48,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 200,
    crystal: "Minéral",
    functions: [
      "Heures, minutes, secondes",
      "Chronographe",
      "Heure universelle",
      "Radio-pilotée",
      "Alarme",
    ],
    ancienneteJours: 25,
  },
  {
    slug: "citizen-promaster-diver-eco-drive-bleu",
    marque: "citizen",
    name: "Promaster Diver Eco-Drive",
    reference: "BN0151-09L",
    shortDescription: "Une vraie montre de plongée ISO, rechargée par la lumière.",
    description:
      "Certifiée ISO 6425, la Promaster Diver résiste à 200 mètres et n'a jamais besoin de pile : la lumière, naturelle ou artificielle, la recharge. Cadran et lunette bleus, index très luminescents et bracelet caoutchouc assorti.",
    priceCents: 24_900,
    stock: 9,
    gender: "HOMME",
    movement: "SOLAIRE",
    caliber: "Eco-Drive E168",
    caseDiameterMm: 44,
    caseThicknessMm: 12.5,
    lugWidthMm: 22,
    caseMaterial: "ACIER",
    strapType: "CAOUTCHOUC",
    strapColor: "bleu",
    dialColor: "bleu",
    waterResistanceM: 200,
    crystal: "Minéral",
    functions: ["Heures, minutes, secondes", "Date", "Lunette tournante"],
    collections: ["montres-de-plongee", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 90,
  },
  {
    slug: "orient-bambino-bleu-nuit",
    marque: "orient",
    name: "Bambino",
    reference: "AC0000AB",
    shortDescription: "La montre habillée automatique de référence, à moins de 250 €.",
    description:
      "Verre bombé, cadran bleu nuit légèrement galbé et chiffres romains dorés : la Bambino évoque les montres des années 50. Son mouvement automatique Orient de manufacture se remonte aussi à la main, et le bracelet en cuir noir complète l'ensemble. Une porte d'entrée idéale dans l'horlogerie mécanique.",
    priceCents: 21_900,
    stock: 10,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "F6724",
    powerReserveH: 40,
    caseDiameterMm: 40.5,
    lugWidthMm: 21,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "noir",
    dialColor: "bleu",
    waterResistanceM: 30,
    crystal: "Minéral bombé",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 40,
  },
  {
    slug: "orient-mako-ii-noir",
    marque: "orient",
    name: "Mako II",
    reference: "CEM75001B",
    shortDescription: "Une plongeuse automatique japonaise, 200 mètres et lunette tournante.",
    description:
      "Lunette unidirectionnelle noire, couronne vissée et 200 mètres d'étanchéité : la Mako est une vraie montre de plongée. Son mouvement automatique maison de 21 rubis affiche le jour et la date, et le bracelet en acier se ferme par une boucle déployante sécurisée.",
    priceCents: 22_900,
    stock: 5,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "46943",
    powerReserveH: 40,
    caseDiameterMm: 41.5,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 200,
    crystal: "Minéral",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Lunette tournante"],
    collections: ["montres-de-plongee", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 35,
  },
  {
    slug: "certina-ds-action-noir",
    marque: "certina",
    name: "DS Action",
    reference: "C013.410.11.051.00",
    shortDescription: "Une montre de sport suisse étanche à 200 mètres, cadran noir.",
    description:
      "Lunette tournante, couronne vissée et 200 mètres d'étanchéité : la DS Action est taillée pour l'eau comme pour le quotidien. Le concept Double Sécurité de Certina protège le mouvement des chocs, et la trotteuse à pointe rouge ajoute une touche de couleur au cadran noir.",
    priceCents: 44_500,
    stock: 4,
    gender: "HOMME",
    movement: "QUARTZ",
    caseDiameterMm: 41,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 200,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Lunette tournante"],
    collections: ["montres-de-plongee", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 22,
  },
  {
    slug: "mido-ocean-star-captain-bleu",
    marque: "mido",
    name: "Ocean Star Captain",
    reference: "M026.430.36.041.00",
    shortDescription: "La plongeuse Mido au cadran bleu brossé et calibre 80 heures.",
    description:
      "Héritière d'une lignée née en 1944, l'Ocean Star Captain associe un cadran bleu brossé, une lunette tournante assortie et le Calibre 80, qui offre 80 heures de réserve de marche. Guichet jour et date, 200 mètres d'étanchéité et fond transparent pour admirer le mouvement.",
    priceCents: 89_000,
    stock: 3,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Calibre 80",
    powerReserveH: 80,
    caseDiameterMm: 42.5,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 200,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Lunette tournante"],
    collections: ["montres-de-plongee"],
    ancienneteJours: 15,
  },
  {
    slug: "mido-commander-ii-chronometre-argente",
    marque: "mido",
    name: "Commander II Chronomètre",
    reference: "M021.431.16.071.00",
    shortDescription: "Une automatique certifiée chronomètre, cadran argenté et cuir marron.",
    description:
      "Le boîtier de la Commander s'inspire de la tour Eiffel. Sa version Chronomètre est certifiée par le COSC, le contrôle officiel suisse de précision. Cadran argenté soleillé, guichet jour et date, bracelet en cuir marron surpiqué : la montre habillée d'un amateur exigeant.",
    priceCents: 99_000,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Calibre 80 Chronomètre",
    powerReserveH: 80,
    caseDiameterMm: 40,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "argente",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Chronomètre certifié COSC"],
    collections: ["montres-habillees"],
    ancienneteJours: 70,
  },
  {
    slug: "frederique-constant-healey-gris",
    marque: "frederique-constant",
    name: "Vintage Rally Healey",
    reference: "FC-303GBRH5B4",
    shortDescription: "Une automatique en édition limitée, inspirée des voitures de rallye Healey.",
    description:
      "Hommage aux Austin-Healey des rallyes des années 50, cette édition limitée à 2 888 exemplaires associe un boîtier plaqué or rose de 40 mm, un cadran gris aux grands chiffres et un bracelet en cuir noir surpiqué de rouge. Mouvement automatique FC-303, verre saphir bombé et fond transparent.",
    editorialNote:
      "La pièce la plus « luxe » de notre sélection : finitions remarquables et présence au poignet. Idéale pour marquer une grande occasion.",
    priceCents: 149_500,
    stock: 1,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "FC-303",
    powerReserveH: 38,
    caseDiameterMm: 40,
    caseThicknessMm: 12.45,
    caseMaterial: "PLAQUE_OR",
    strapType: "CUIR",
    strapColor: "noir",
    dialColor: "gris",
    waterResistanceM: 50,
    crystal: "Saphir bombé",
    functions: ["Heures, minutes, secondes", "Date"],
    ancienneteJours: 100,
  },
];
