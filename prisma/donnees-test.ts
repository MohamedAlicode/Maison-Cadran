// Jeu de données de test : 8 marques, 19 montres réalistes, 3 collections, quelques avis.
// Les caractéristiques suivent les fiches des fabricants ; les prix sont indicatifs (TTC).

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
      "Citizen a lancé l'Eco-Drive en 1976. Ses montres solaires fonctionnent des mois dans l'obscurité une fois chargées. La maison produit aussi des automatiques de grande qualité comme la Tsuyosa.",
  },
  {
    slug: "orient",
    name: "Orient",
    country: "Japon",
    foundedYear: 1950,
    description:
      "Des automatiques de manufacture à des prix imbattables, référence des premiers achats mécaniques.",
    history:
      "Orient fabrique ses propres mouvements automatiques depuis plus de soixante ans. La Bambino est devenue la montre habillée de référence sous 200 €, et la Mako une plongeuse appréciée des collectionneurs.",
  },
  {
    slug: "certina",
    name: "Certina",
    country: "Suisse",
    foundedYear: 1888,
    description:
      "Le concept « Double Sécurité » (DS) : des montres suisses conçues pour résister aux chocs.",
    history:
      "Depuis 1959, le système DS protège le mouvement et renforce l'étanchéité. La DS Action Diver est certifiée ISO 6425, la norme des vraies montres de plongée.",
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
      "Fondée à Genève en 1988, Frederique Constant s'est donné pour mission de rendre accessible l'horlogerie de luxe suisse. La collection Classics reprend les codes intemporels de la montre habillée.",
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
    slug: "tissot-prx-powermatic-80-40mm-bleu",
    marque: "tissot",
    name: "PRX Powermatic 80",
    reference: "T137.407.11.041.00",
    familyKey: "tissot-prx-40",
    shortDescription: "L'icône des années 70 au bracelet intégré, cadran bleu à motif gaufré.",
    description:
      "La PRX reprend le dessin d'un modèle Tissot de 1978 : boîtier en tonneau, bracelet intégré et finitions alternant poli et satiné. Son cadran bleu à motif « clous de Paris » capte la lumière sous un verre saphir. Le mouvement Powermatic 80 offre 80 heures de réserve de marche : retirée le vendredi soir, elle tourne encore le lundi matin.",
    editorialNote:
      "Notre meilleure vente, et pour cause : c'est la montre suisse automatique la plus aboutie à ce prix. Le bracelet se règle facilement et le confort surprend pour une montre en acier.",
    priceCents: 72_500,
    stock: 6,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111",
    powerReserveH: 80,
    caseDiameterMm: 40,
    caseThicknessMm: 10.9,
    lugWidthMm: 12,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    ancienneteJours: 5,
  },
  {
    slug: "tissot-prx-powermatic-80-40mm-vert",
    marque: "tissot",
    name: "PRX Powermatic 80",
    reference: "T137.407.11.091.00",
    familyKey: "tissot-prx-40",
    shortDescription: "La PRX dans sa déclinaison vert sapin, au motif gaufré.",
    description:
      "Même boîtier en tonneau et même bracelet intégré que la version bleue, avec un cadran vert profond qui change de teinte selon la lumière. Mouvement Powermatic 80, 80 heures de réserve de marche, verre saphir et étanchéité 100 mètres.",
    priceCents: 72_500,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111",
    powerReserveH: 80,
    caseDiameterMm: 40,
    caseThicknessMm: 10.9,
    lugWidthMm: 12,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "vert",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    ancienneteJours: 12,
  },
  {
    slug: "tissot-prx-35mm-quartz-argente",
    marque: "tissot",
    name: "PRX 35 mm",
    reference: "T137.210.11.031.00",
    familyKey: "tissot-prx-35",
    shortDescription: "La PRX en 35 mm et quartz, pour les poignets fins.",
    description:
      "La version 35 mm de la PRX garde toute l'allure de l'originale dans un format plus délicat. Son mouvement quartz suisse se fait oublier : précis, sans remontage, avec une pile qui dure plusieurs années.",
    priceCents: 37_500,
    stock: 8,
    gender: "FEMME",
    movement: "QUARTZ",
    caliber: "ETA F06.115",
    caseDiameterMm: 35,
    caseThicknessMm: 9.7,
    lugWidthMm: 11,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "argente",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 30,
  },
  {
    slug: "tissot-gentleman-powermatic-80-silicium-argente",
    marque: "tissot",
    name: "Gentleman Powermatic 80 Silicium",
    reference: "T127.407.11.031.00",
    shortDescription: "La montre de tous les jours, avec spiral en silicium antimagnétique.",
    description:
      "La Gentleman passe du costume au week-end sans effort. Son spiral en silicium la protège des champs magnétiques du quotidien (téléphone, ordinateur), gage de précision sur la durée. Boîtier de 40 mm, cadran argenté soleillé et réserve de marche de 80 heures.",
    priceCents: 79_500,
    stock: 4,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111 Silicium",
    powerReserveH: 80,
    caseDiameterMm: 40,
    caseThicknessMm: 10.6,
    lugWidthMm: 21,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "argente",
    waterResistanceM: 100,
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
    slug: "hamilton-khaki-field-auto-42mm-noir",
    marque: "hamilton",
    name: "Khaki Field Auto",
    reference: "H70555533",
    shortDescription: "L'esprit militaire en version automatique, sur bracelet cuir.",
    description:
      "Plus grande et automatique, la Khaki Field Auto garde la lisibilité des montres de terrain : grands chiffres, aiguilles luminescentes, échelle des 24 heures. Le bracelet en cuir marron patine joliment avec le temps.",
    priceCents: 84_500,
    stock: 3,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "H-10",
    powerReserveH: 80,
    caseDiameterMm: 42,
    caseThicknessMm: 11.7,
    lugWidthMm: 22,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "noir",
    waterResistanceM: 100,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Jour"],
    ancienneteJours: 90,
  },
  {
    slug: "hamilton-jazzmaster-open-heart-40mm-bleu",
    marque: "hamilton",
    name: "Jazzmaster Open Heart",
    reference: "H32675140",
    shortDescription: "Un cadran ouvert sur le balancier, pour voir battre le cœur de la montre.",
    description:
      "L'ouverture à 9 heures dévoile le balancier qui oscille six fois par seconde. Cadran bleu soleillé, boîtier poli de 40 mm et bracelet en cuir bleu : une montre habillée qui se remarque sans ostentation.",
    priceCents: 104_500,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "H-10",
    powerReserveH: 80,
    caseDiameterMm: 40,
    caseThicknessMm: 11.8,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "bleu",
    dialColor: "bleu",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Cœur ouvert"],
    collections: ["montres-habillees"],
    ancienneteJours: 45,
  },
  {
    slug: "seiko-presage-cocktail-time-blue-moon",
    marque: "seiko",
    name: "Presage Cocktail Time « Blue Moon »",
    reference: "SRPB43J1",
    shortDescription: "Un cadran inspiré d'un cocktail, travaillé comme une étoffe.",
    description:
      "La série Cocktail Time est née d'une collaboration avec un barman de Tokyo. Le cadran bleu à reflets rayonnants évoque le cocktail Blue Moon. Mouvement automatique 4R35 de manufacture, bracelet en cuir marron et fond transparent.",
    editorialNote:
      "Le cadran est encore plus beau en vrai qu'en photo. Un excellent choix pour offrir.",
    priceCents: 49_000,
    stock: 1,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "4R35",
    powerReserveH: 41,
    caseDiameterMm: 40.5,
    caseThicknessMm: 11.8,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "bleu",
    waterResistanceM: 50,
    crystal: "Hardlex",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 8,
  },
  {
    slug: "seiko-5-sports-srpd55-noir",
    marque: "seiko",
    name: "5 Sports",
    reference: "SRPD55K1",
    shortDescription: "La plongeuse automatique qui a initié des générations d'amateurs.",
    description:
      "Héritière de la mythique SKX, la Seiko 5 Sports garde la lunette tournante et le boîtier coussin, avec un mouvement 4R36 visible par le fond. Robuste, fiable, et un prix qui en fait la montre automatique d'entrée idéale.",
    priceCents: 29_900,
    stock: 10,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "4R36",
    powerReserveH: 41,
    caseDiameterMm: 42.5,
    caseThicknessMm: 13.4,
    lugWidthMm: 22,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "noir",
    waterResistanceM: 100,
    crystal: "Hardlex",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Lunette tournante"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 120,
  },
  {
    slug: "seiko-prospex-alpinist-spb121-vert",
    marque: "seiko",
    name: "Prospex Alpinist",
    reference: "SPB121J1",
    shortDescription: "La montre des alpinistes, avec boussole intérieure et cadran vert.",
    description:
      "Créée en 1959 pour les montagnards japonais, l'Alpinist associe un cadran vert émeraude à une lunette intérieure de boussole, réglée par la seconde couronne. Mouvement 6R35 de 70 heures, verre saphir et étanchéité 200 mètres.",
    priceCents: 79_500,
    stock: 0,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "6R35",
    powerReserveH: 70,
    caseDiameterMm: 39.5,
    caseThicknessMm: 13.2,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "vert",
    waterResistanceM: 200,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Boussole intérieure"],
    ancienneteJours: 75,
  },
  {
    slug: "citizen-tsuyosa-40mm-vert",
    marque: "citizen",
    name: "Tsuyosa",
    reference: "NJ0150-81X",
    shortDescription: "Bracelet intégré, loupe sur la date et cadran vert soleillé.",
    description:
      "La Tsuyosa (« forte » en japonais) offre l'allure des montres à bracelet intégré à un prix très doux. Mouvement automatique Citizen 8210, verre saphir et loupe sur la date pour une lecture facile.",
    priceCents: 36_900,
    compareAtCents: 39_900,
    stock: 7,
    gender: "MIXTE",
    movement: "AUTOMATIQUE",
    caliber: "8210",
    powerReserveH: 40,
    caseDiameterMm: 40,
    caseThicknessMm: 11.7,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "vert",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 15,
  },
  {
    slug: "citizen-promaster-diver-eco-drive-noir",
    marque: "citizen",
    name: "Promaster Diver Eco-Drive",
    reference: "BN0150-28E",
    shortDescription: "Une vraie montre de plongée ISO, rechargée par la lumière.",
    description:
      "Certifiée ISO 6425, la Promaster Diver résiste à 200 mètres et n'a jamais besoin de pile : la lumière, naturelle ou artificielle, la recharge. Lunette unidirectionnelle, index très luminescents et bracelet caoutchouc.",
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
    strapColor: "noir",
    dialColor: "noir",
    waterResistanceM: 200,
    crystal: "Minéral",
    functions: ["Heures, minutes, secondes", "Date", "Lunette tournante"],
    collections: ["montres-de-plongee", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 200,
  },
  {
    slug: "citizen-eco-drive-silhouette-30mm-blanc",
    marque: "citizen",
    name: "Eco-Drive Silhouette",
    reference: "EM0500-73A",
    shortDescription: "Une montre féminine fine et solaire, au cadran blanc nacré.",
    description:
      "Boîtier de 30 mm, lignes fines et cadran blanc : la Silhouette se porte au quotidien comme en soirée. Grâce à l'Eco-Drive, plus besoin de changer la pile.",
    priceCents: 22_900,
    stock: 6,
    gender: "FEMME",
    movement: "SOLAIRE",
    caliber: "Eco-Drive E031",
    caseDiameterMm: 30,
    caseThicknessMm: 7.5,
    lugWidthMm: 14,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "blanc",
    waterResistanceM: 50,
    crystal: "Minéral",
    functions: ["Heures, minutes"],
    collections: ["idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 25,
  },
  {
    slug: "orient-bambino-version-2-creme",
    marque: "orient",
    name: "Bambino Version 2",
    reference: "FAC00009W0",
    shortDescription: "La montre habillée automatique de référence, à moins de 200 €.",
    description:
      "Verre bombé, cadran crème légèrement galbé et index bâtons : la Bambino évoque les montres des années 50. Mouvement automatique Orient de manufacture, bracelet cuir noir. Une porte d'entrée idéale dans l'horlogerie mécanique.",
    priceCents: 18_900,
    stock: 12,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "F6724",
    powerReserveH: 40,
    caseDiameterMm: 40.5,
    caseThicknessMm: 12.3,
    lugWidthMm: 21,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "noir",
    dialColor: "creme",
    waterResistanceM: 30,
    crystal: "Minéral bombé",
    functions: ["Heures, minutes, secondes"],
    collections: ["montres-habillees", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 150,
  },
  {
    slug: "orient-mako-iii-bleu",
    marque: "orient",
    name: "Mako III",
    reference: "RA-AA0008L19B",
    shortDescription: "Une plongeuse automatique à remontage manuel et seconde stop.",
    description:
      "La troisième génération de la Mako gagne un mouvement maison qui se remonte à la main et arrête la trotteuse pour une mise à l'heure précise. Cadran bleu soleillé, lunette tournante et 200 mètres d'étanchéité.",
    priceCents: 29_900,
    stock: 5,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "F6922",
    powerReserveH: 40,
    caseDiameterMm: 41.8,
    caseThicknessMm: 13,
    lugWidthMm: 22,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 200,
    crystal: "Minéral",
    functions: ["Heures, minutes, secondes", "Date", "Jour", "Lunette tournante"],
    collections: ["montres-de-plongee", "idees-cadeaux-moins-de-500-euros"],
    ancienneteJours: 40,
  },
  {
    slug: "certina-ds-action-diver-powermatic-80-bleu",
    marque: "certina",
    name: "DS Action Diver Powermatic 80",
    reference: "C032.607.11.041.00",
    shortDescription: "Une plongeuse suisse certifiée ISO 6425, 300 mètres et 80 heures.",
    description:
      "Lunette en céramique, 300 mètres d'étanchéité et certification ISO 6425 : la DS Action Diver est une vraie montre professionnelle. Le concept Double Sécurité protège le mouvement Powermatic 80 des chocs.",
    priceCents: 89_000,
    stock: 3,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Powermatic 80.111",
    powerReserveH: 80,
    caseDiameterMm: 43,
    caseThicknessMm: 12.9,
    lugWidthMm: 21,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 300,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Lunette tournante"],
    collections: ["montres-de-plongee"],
    ancienneteJours: 20,
  },
  {
    slug: "mido-ocean-star-200c-bleu",
    marque: "mido",
    name: "Ocean Star 200C",
    reference: "M042.430.11.041.00",
    shortDescription: "La plongeuse Mido en lunette céramique et calibre 80 heures.",
    description:
      "Héritière d'une lignée née en 1944, l'Ocean Star 200C associe un cadran bleu dégradé, une lunette en céramique et un calibre 80 à spiral Nivachron antimagnétique. Fond transparent pour admirer le mouvement.",
    priceCents: 109_000,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "Calibre 80",
    powerReserveH: 80,
    caseDiameterMm: 42.5,
    caseThicknessMm: 12.4,
    lugWidthMm: 22,
    caseMaterial: "ACIER",
    strapType: "ACIER",
    dialColor: "bleu",
    waterResistanceM: 200,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date", "Lunette tournante"],
    collections: ["montres-de-plongee"],
    ancienneteJours: 2,
  },
  {
    slug: "mido-baroncelli-signature-lady-argente",
    marque: "mido",
    name: "Baroncelli Signature Lady",
    reference: "M037.207.16.031.00",
    shortDescription: "Une automatique féminine et fine, au cadran argenté et bracelet cuir.",
    description:
      "Inspirée de la galerie Vittorio Emanuele de Milan, la Baroncelli Signature joue la finesse : boîtier de 30 mm, cadran argenté à motif rayonnant et bracelet cuir noir. Un mouvement automatique suisse pour celles qui aiment les montres qui vivent.",
    priceCents: 79_000,
    stock: 3,
    gender: "FEMME",
    movement: "AUTOMATIQUE",
    caliber: "Calibre 80",
    powerReserveH: 80,
    caseDiameterMm: 30,
    caseThicknessMm: 9.5,
    lugWidthMm: 15,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "noir",
    dialColor: "argente",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees"],
    ancienneteJours: 33,
  },
  {
    slug: "frederique-constant-classics-index-automatic-bleu",
    marque: "frederique-constant",
    name: "Classics Index Automatic",
    reference: "FC-303MN5B6",
    shortDescription: "La montre habillée genevoise, cadran bleu nuit et aiguilles dorées.",
    description:
      "Boîtier poli de 40 mm, chiffres romains appliqués et aiguilles feuille : la Classics Index incarne la montre habillée suisse dans ce qu'elle a de plus intemporel. Mouvement automatique FC-303 et fond transparent.",
    editorialNote:
      "La pièce la plus « luxe » de notre sélection : finitions remarquables et présence au poignet. Idéale pour marquer une grande occasion.",
    priceCents: 115_000,
    stock: 2,
    gender: "HOMME",
    movement: "AUTOMATIQUE",
    caliber: "FC-303",
    powerReserveH: 38,
    caseDiameterMm: 40,
    caseThicknessMm: 11,
    lugWidthMm: 20,
    caseMaterial: "ACIER",
    strapType: "CUIR",
    strapColor: "marron",
    dialColor: "bleu",
    waterResistanceM: 50,
    crystal: "Saphir",
    functions: ["Heures, minutes, secondes", "Date"],
    collections: ["montres-habillees"],
    ancienneteJours: 10,
  },
];

export const clientsTest = [
  { email: "claire.martin@exemple.fr", name: "Claire M." },
  { email: "thomas.durand@exemple.fr", name: "Thomas D." },
  { email: "sophie.bernard@exemple.fr", name: "Sophie B." },
  { email: "julien.petit@exemple.fr", name: "Julien P." },
];

export const avisTest: {
  produit: string;
  client: string;
  rating: number;
  title: string;
  body: string;
  ancienneteJours: number;
}[] = [
  {
    produit: "tissot-prx-powermatic-80-40mm-bleu",
    client: "thomas.durand@exemple.fr",
    rating: 5,
    title: "Encore plus belle en vrai",
    body: "Le cadran bleu change avec la lumière, les finitions sont superbes pour le prix. Livraison rapide et emballage soigné.",
    ancienneteJours: 3,
  },
  {
    produit: "tissot-prx-powermatic-80-40mm-bleu",
    client: "julien.petit@exemple.fr",
    rating: 4,
    title: "Très belle montre",
    body: "Bracelet un peu long à ajuster soi-même, mais le service client m'a guidé. La réserve de marche est bluffante.",
    ancienneteJours: 9,
  },
  {
    produit: "hamilton-khaki-field-mechanical-38mm-noir",
    client: "claire.martin@exemple.fr",
    rating: 5,
    title: "Offerte à mon compagnon",
    body: "Il la porte tous les jours. Le remontage du matin est devenu un rituel. Écrin et documents bien présents.",
    ancienneteJours: 2,
  },
  {
    produit: "seiko-presage-cocktail-time-blue-moon",
    client: "sophie.bernard@exemple.fr",
    rating: 5,
    title: "Un cadran incroyable",
    body: "Les photos ne rendent pas justice au cadran. Montre bien emballée, reçue en deux jours.",
    ancienneteJours: 5,
  },
  {
    produit: "orient-bambino-version-2-creme",
    client: "thomas.durand@exemple.fr",
    rating: 4,
    title: "Parfaite pour débuter",
    body: "Élégante et très bien finie pour le prix. Le bracelet d'origine est correct, je l'ai remplacé par un cuir plus souple.",
    ancienneteJours: 40,
  },
  {
    produit: "citizen-promaster-diver-eco-drive-noir",
    client: "julien.petit@exemple.fr",
    rating: 5,
    title: "Increvable",
    body: "Je l'emmène en mer et à la piscine sans souci. Jamais à remonter, jamais de pile : exactement ce que je voulais.",
    ancienneteJours: 60,
  },
];
