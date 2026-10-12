---
name: Maison Cadran
description: Boutique de montres neuves de 100 à 2 000 €, direction « Acier et cadran bleu »
colors:
  acier: "#f1f1ee"
  blanc: "#ffffff"
  nuit: "#111b29"
  encre: "#15191c"
  graphite: "#555c61"
  filet: "#d9dad6"
  filet-fort: "#7e8482"
  cadran: "#1f3a5f"
  cadran-fonce: "#162e4c"
  cadran-clair: "#a9bedb"
  sauge: "#2f6b4a"
  ambre: "#8f5a12"
  bordeaux: "#a3302b"
typography:
  display:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
  eyebrow:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.14em"
  price:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    fontFeature: "tnum, lnum"
rounded:
  xs: "2px"
  full: "9999px"
spacing:
  unit: "4px"
  photo-serree: "4%"
  photo: "10%"
  photo-large: "12%"
components:
  button-primary:
    backgroundColor: "{colors.cadran}"
    textColor: "{colors.blanc}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "48px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.cadran-fonce}"
  button-secondary:
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "48px"
    padding: "0 28px"
  button-secondary-hover:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.acier}"
  button-light:
    backgroundColor: "{colors.acier}"
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "48px"
  input:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.encre}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    height: "48px"
    padding: "0 16px"
  badge-new:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.acier}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  product-photo:
    backgroundColor: "{colors.blanc}"
    padding: "{spacing.photo}"
---

# Design System: Maison Cadran

## Overview

**Creative North Star: « L'établi de l'horloger »**

Un plan de travail en acier, une lumière franche, et la montre posée au centre. Tout le reste s'efface : la page est d'un blanc légèrement grisé, comme un boîtier brossé, et la seule couleur vive est le bleu soleillé des cadrans. Ce bleu ne décore pas : il marque ce qu'on peut faire (acheter, suivre un lien, savoir où est le focus).

La densité est faible et l'espace généreux, parce qu'un premier acheteur doit pouvoir regarder une montre sans être pressé. La hiérarchie de chaque produit est toujours la même : marque en petites capitales, modèle en serif, prix en chiffres tabulaires.

Le verre dépoli existe, mais seulement là où il a une fonction : l'en-tête collant et les barres posées sur une photo. Jamais en carte décorative.

**Key Characteristics:**

- Fond acier, photos sur blanc pur : la montre flotte, sans cadre.
- Un seul accent, le bleu cadran, réservé aux actions, aux liens et au focus.
- Serif étroit pour nommer, grotesque net pour informer.
- Coins quasi droits (2px), filets fins plutôt que des ombres.

## Colors

Une palette froide et retenue : des neutres teintés vers le bleu, un accent unique, des états sourds.

### Primary

- **Bleu cadran** (cadran) : boutons principaux, liens, chiffres de filtres, anneau de focus, sélection de texte. 10:1 sur l'acier.
- **Bleu cadran profond** (cadran-fonce) : survol des boutons principaux.
- **Bleu cadran pâle** (cadran-clair) : seul accent autorisé sur fond nuit (sur-titres et liens du pied de page, mot en italique du hero). 9:1 sur la nuit.

### Neutral

- **Acier brossé** (acier) : fond de page, texte clair sur fond nuit.
- **Blanc photo** (blanc) : fond des photos, champs, tiroirs, sections de contenu en alternance avec l'acier.
- **Nuit bleutée** (nuit) : hero, pied de page, voile des tiroirs.
- **Encre** (encre) : texte courant, titres, badge « Nouveau ».
- **Graphite** (graphite) : texte secondaire et sur-titres. 6:1 sur l'acier.
- **Filet** (filet) : bordures et séparateurs décoratifs.
- **Filet fort** (filet-fort) : contour des contrôles (cases, champs au survol), qui doit atteindre 3:1.

### Tertiary

- **Sauge** (sauge) : en stock, succès.
- **Ambre** (ambre) : stock faible, « Dernière pièce ».
- **Bordeaux** (bordeaux) : erreurs.

### Named Rules

**La règle du cadran unique.** Le bleu cadran est la seule couleur d'accent. Une deuxième teinte vive n'entre pas sans décision écrite dans ce fichier.

**La règle de l'acier teinté.** Aucun noir ni gris pur : les neutres tirent toujours vers le bleu (encre, graphite, nuit).

## Typography

**Display Font:** Instrument Serif (repli Times New Roman, serif)
**Body Font:** Hanken Grotesk (repli system-ui)

**Character:** un serif étroit et vif, plus proche d'une gravure de fond de boîte que d'un livre, posé sur une grotesque aux chiffres nets.

### Hierarchy

- **Display** (400, 3rem à 4.5rem, interligne 1.05) : titre du hero et nom du modèle sur la fiche produit.
- **Headline** (400, 1.875rem à 3rem, interligne 1.1) : titres de section.
- **Title** (400, 1.25rem) : nom du modèle sur une carte produit.
- **Body** (400, 1rem, interligne 1.5) : texte courant, 65 caractères de large au plus.
- **Label** (500, 0.8125rem, approche 0.14em, capitales) : boutons et navigation.
- **Eyebrow** (500, 0.75rem, approche 0.14em, capitales, graphite) : marque au-dessus du modèle, sur-titres.
- **Price** (500, 1rem, chiffres tabulaires) : prix partout.

### Named Rules

**La règle du poids unique.** Instrument Serif n'a qu'une graisse : un titre n'est jamais en `font-medium` ou plus, sous peine de faux gras.

**La règle marque, modèle, prix.** Sur toute présentation produit, cet ordre et ces trois styles (eyebrow, title ou display, price) ne changent pas.

## Layout

Conteneur de 1440px au plus (`max-w-site`), gouttières de 24px en mobile (16px dans l'en-tête) et 48px dès 1024px. Toutes les marges suivent un pas de 4px. Les grilles produit passent de 2 colonnes (mobile) à 3 (tablette) puis 4 (desktop), ou 3 à côté de la colonne de filtres. Les sections alternent fond acier et fond blanc, séparées par un filet, avec 64 à 112px de respiration verticale. Les vérifications se font à 375, 768, 1024 et 1440px.

Les photos gardent une marge intérieure en pourcentage pour que la montre respire de la même façon à toutes les tailles : 10% sur les vignettes et la galerie, 12% dans le médaillon du hero, 4% pour la seconde vue au survol.

## Elevation & Depth

Système plat. La profondeur vient de l'alternance acier et blanc et des filets, pas des ombres. Une seule ombre existe, teintée nuit, pour ce qui passe au-dessus de la page.

### Shadow Vocabulary

- **Tiroir** (`box-shadow: 0 24px 48px -12px rgb(17 27 41 / 0.28)`) : tiroirs latéraux (menu mobile, filtres, futur mini-panier).

### Named Rules

**La règle du verre utile.** Le flou d'arrière-plan (16px) sert uniquement à garder lisible un élément collant ou posé sur une photo. Il a toujours un fond assez opaque (85% au moins) pour que le texte garde 4.5:1, et jamais de reflet ni de lueur.

## Shapes

Coins quasi droits (2px) sur les boutons, champs, badges et tiroirs, comme un boîtier usiné. Le cercle (rayon plein) est réservé aux formes qui sont rondes en vrai : médaillon du hero, pastilles de couleur de cadran, points d'état.

## Components

### Buttons

- **Shape:** coins quasi droits (2px), hauteur 40, 48 ou 56px.
- **Primary:** fond bleu cadran, texte blanc, capitales espacées. Un filet clair se déploie de gauche à droite sous le libellé au survol.
- **Hover / Focus:** passage au bleu profond (180ms, `ease-maison`), anneau de focus bleu cadran décalé de 2px.
- **Secondary:** contour encre qui se remplit d'encre au survol. **Clair :** fond acier, pour les fonds nuit. **Fantôme :** texte seul, voile filet au survol.

### Chips (Badges)

- **Style:** capitales 12px sur fond plein, coins de 2px. « Nouveau » en encre, « Dernière pièce » sur ambre pâle, « Offre » sur bleu cadran pâle, « En stock » sur sauge pâle, chacun avec son texte dans la teinte pleine.

### Cards / Containers

- **Corner Style:** aucun arrondi sur les cartes produit.
- **Background:** photo sur blanc, texte directement sur le fond de la section.
- **Shadow Strategy:** aucune (voir Elevation & Depth).
- **Border:** aucune. La carte est un lien entier, avec le focus dessiné autour.

### Inputs / Fields

- **Style:** fond blanc, filet de 1px, coins de 2px, texte 16px (empêche le zoom automatique sur iPhone).
- **Focus:** bordure encre et anneau bleu cadran.
- **Error / Disabled:** message en bordeaux sous le champ ; désactivé à 60% d'opacité.

### Navigation

- **Style:** en-tête collant en verre (acier à 85%, flou 16px), logo centré en serif capitales, liens en libellés capitales qui passent au bleu cadran au survol. Icônes Lucide de 20px, trait 1.5, dans des zones de 44px. En dessous de 1280px, le menu passe dans un tiroir : les cinq liens et les quatre icônes ne tiennent pas autour du logo plus tôt.

## Do's and Don'ts

### Do:

- **Do** présenter chaque montre sur blanc pur avec sa marge en pourcentage.
- **Do** utiliser le bleu cadran pour tout ce qui est cliquable, et rien d'autre.
- **Do** écrire les prix en chiffres tabulaires.
- **Do** passer par les tokens de `src/app/globals.css` : aucune couleur, taille ou durée en dur.
- **Do** respecter `prefers-reduced-motion` (géré globalement) et garder un focus visible.

### Don't:

- **Don't** utiliser de dégradés violet ou bleu, de lueurs, de glassmorphism décoratif ou d'easing rebondissant.
- **Don't** mettre une carte dans une carte.
- **Don't** utiliser d'emojis comme icônes : SVG Lucide uniquement.
- **Don't** utiliser de noir ou de gris purs.
- **Don't** utiliser Inter, Arial ou une police système comme police de marque.
- **Don't** afficher de logo officiel de marque ni écrire « garantie constructeur ».
