# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Une personne qui achète sa première montre « sérieuse » : elle quitte la montre connectée ou la montre de mode pour un vrai garde-temps, et hésite encore entre des marques qu'elle connaît mal. Elle compare, a besoin d'être rassurée sur l'authenticité et la garantie, et décide souvent sur mobile.

## Product Purpose

Maison Cadran est une boutique en ligne de montres neuves de 100 à 2 000 € (Tissot, Hamilton, Seiko, Citizen, Orient, Mido, Certina, Frederique Constant). Elle vend en France métropolitaine, en euros TTC. Réussir, c'est qu'un premier acheteur ose passer commande en ligne pour une montre de ce prix.

## Positioning

Le site lui-même est la raison d'acheter ici : une expérience qui attire et séduit vraiment, là où les grands sites alignent des fiches sans âme. Les marques et les prix sont les mêmes qu'ailleurs, donc l'expérience doit faire la différence.

## Capabilities and Constraints

- Catalogue filtrable, fiches produit, collections et pages marques : en place (Next.js 16, Tailwind 4, Prisma, PostgreSQL).
- Panier et paiement Stripe (mode test, 3x/4x via Klarna) : prévus en phase 3, pas encore construits.
- Livraison offerte dès 150 €, 9,90 € sinon (Colissimo contre signature). Rétractation 14 jours. Garantie 2 ans. Valeurs centralisées dans `src/config/boutique.ts`.
- Club de membres exclusif : demandé par le propriétaire le 2026-10-12, avec un appel à l'adhésion. Non construit, et son contenu (avantages, conditions, gratuit ou payant) n'est pas défini. Ne pas inventer d'avantages.
- Neuf uniquement. Pas d'occasion.

## Brand Commitments

- Nom : Maison Cadran. Vouvoiement, en français.
- Ton voulu : élégant, sophistiqué, exclusif.
- Contrainte visuelle posée par le propriétaire : des effets « verre liquide » (liquid glass). Ses règles de projet interdisent par ailleurs le glassmorphism décoratif ; l'arbitrage entre les deux reste ouvert.
- Revendeur agréé non confirmé : écrire « Garantie 2 ans », jamais « garantie constructeur », et n'utiliser aucun logo officiel de marque.

## Evidence on Hand

- 19 montres de test (`prisma/donnees-test.ts`), avec quelques avis de test : ce ne sont pas de vrais clients.
- Visuels : illustrations SVG générées (`public/images/montres/`), à remplacer par de vraies photos.
- Aucun témoignage réel, aucun chiffre de membres, aucune presse. Ne rien inventer de tel.

## Product Principles

1. La montre est la vedette : chaque écran sert la photo, puis marque, modèle, prix.
2. Rassurer sans crier : garantie, authenticité et retours toujours visibles, jamais tapageurs.
3. Expliquer pour un débutant : caractéristiques lisibles (mouvement, diamètre, matériaux, étanchéité), sans jargon non expliqué.
4. L'exclusivité se montre par le soin, pas par des promesses invérifiables.

## Accessibility & Inclusion

Contraste texte d'au moins 4,5:1, focus clavier visible, `prefers-reduced-motion` respecté, vérification à 375, 768, 1024 et 1440 px.
