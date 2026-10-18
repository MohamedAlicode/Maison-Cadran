# Maison Cadran

[![CI](https://github.com/MohamedAlicode/Maison-Cadran/actions/workflows/ci.yml/badge.svg)](https://github.com/MohamedAlicode/Maison-Cadran/actions/workflows/ci.yml)

Boutique en ligne de montres de « luxe accessible » (100 € à 2 000 €), construite sur mesure, sans CMS, avec Next.js, TypeScript, Prisma et PostgreSQL.

> **Projet portfolio.** Maison Cadran est une boutique fictive : aucune montre n'est vendue. Les marques et les modèles servent de données de test, et le paiement fonctionnera uniquement en mode test Stripe.

## Ce que le projet montre

- **Un catalogue filtrable** : 19 montres, 9 filtres combinables (marque, prix, mouvement, diamètre, bracelet, étanchéité…) avec le nombre de résultats sur chaque option, et un tri. Tout l'état vit dans l'URL : une recherche se partage et se met en favori.
- **Des fiches produit complètes** : galerie avec zoom, autres coloris, stock et délai, caractéristiques par rubrique, avis, montres similaires.
- **Le rendu moderne de Next.js 16** : pages prérendues au build (Partial Prerendering), lectures en base mises en cache et invalidables par étiquette.
- **Un SEO soigné** : métadonnées par page, données structurées `Product` et `BreadcrumbList`, URL canonique pour les combinaisons de filtres.
- **Un parcours d'achat complet** : panier, codes promo, paiement Stripe Checkout (mode test), webhook idempotent, facture PDF numérotée, comptes clients par lien magique et back-office sous `/admin`.
- **Un modèle de données pensé pour la suite** : commandes, factures, codes promo, avis et événements Stripe sont dans le schéma Prisma dès le départ.
- **De la rigueur sur l'argent** : tous les prix sont des entiers en centimes TTC, la TVA est recalculée et jamais stockée en flottant.
- **De la qualité vérifiée** : TypeScript strict, variables d'environnement validées par Zod, tests Vitest sur la logique de prix et de filtres, CI GitHub Actions.

## Avancement

| Étape | Contenu | Statut |
|---|---|---|
| 0 | Cadrage : arborescence, schéma de base de données, charte | Fait ([docs/etape-0.md](docs/etape-0.md)) |
| 1 | Setup du projet et design system | Fait ([#1](https://github.com/MohamedAlicode/Maison-Cadran/pull/1)) |
| 2 | Catalogue, filtres et fiche produit | Fait ([#2](https://github.com/MohamedAlicode/Maison-Cadran/pull/2)) |
| Refonte | Direction visuelle « Acier et cadran bleu », style « Épuré + verre » | Fait ([#4](https://github.com/MohamedAlicode/Maison-Cadran/pull/4)) |
| 3 | Panier et paiement Stripe (mode test), webhooks, e-mails, facture PDF | Fait ([#7](https://github.com/MohamedAlicode/Maison-Cadran/pull/7)) |
| 4 | Comptes clients (lien magique), favoris | Fait ([#9](https://github.com/MohamedAlicode/Maison-Cadran/pull/9)) |
| 5 | Back-office : produits, stock, commandes, codes promo, avis, guide | Fait ([#10](https://github.com/MohamedAlicode/Maison-Cadran/pull/10)) |
| 6 | SEO, performances, démo en ligne | À venir |

## Stack

| Outil | Rôle |
|---|---|
| Next.js 16 (App Router) + React 19 | Rendu serveur, routes, cache |
| TypeScript (strict) | Typage de bout en bout, jusqu'aux routes |
| Tailwind CSS 4 | Styles ; la charte est déclarée en tokens dans `src/app/globals.css` |
| PostgreSQL + Prisma 7 | Base de données et accès typé |
| Radix UI | Composants accessibles (tiroirs, accordéons, cases à cocher) |
| Zod | Validation des variables d'environnement, puis des formulaires et du panier |
| Vitest | Tests unitaires |
| Stripe, Auth.js, Resend | Paiement, connexion et e-mails (phases 3 et 4) |

## Organisation du code

```
src/
├── app/
│   ├── (boutique)/        Pages publiques : accueil, montres, marques, collections
│   └── api/sante/         Vérifie la connexion à la base
├── components/
│   ├── ui/                Briques réutilisables : bouton, badge, champ, tiroir…
│   ├── layout/            En-tête, pied de page, menu mobile
│   ├── catalogue/         Filtres, tri, grille et cartes produit
│   ├── produit/           Galerie, caractéristiques, avis
│   └── seo/               Données structurées JSON-LD
├── config/boutique.ts     Nom, livraison, retours, garantie : tout au même endroit
└── lib/
    ├── filtres.ts         Logique des filtres et du tri (pure, testée)
    ├── catalogue.ts       Lectures en base mises en cache
    ├── prix.ts            Calculs en centimes : TVA, livraison, formatage
    ├── env.ts             Variables d'environnement validées au démarrage
    └── db.ts              Client Prisma unique
prisma/                    Schéma, migrations et jeu de données de test
tests/unit/                Tests Vitest
```

## Choix techniques

- **Filtrer en mémoire plutôt qu'en SQL.** Le catalogue est chargé une fois sous forme d'index léger et mis en cache. Les filtres et les compteurs se calculent sur cet index. C'est plus simple et plus rapide qu'une requête par combinaison, et ça tient jusqu'à quelques milliers de références.
- **Des compteurs qui ignorent leur propre filtre.** Le chiffre affiché à côté d'une option correspond au nombre de résultats si on la coche, en tenant compte des autres filtres.
- **Le prix vient toujours du serveur.** Le panier ne transmettra que des identifiants et des quantités : le montant payé est recalculé côté serveur à partir de la base.
- **Le stock baisse après le paiement, pas avant.** Il sera décrémenté par le webhook Stripe, une fois le paiement confirmé.

## Démarrer en local

Prérequis : Node.js 22 ou plus récent, et une base PostgreSQL (locale, ou gratuite sur [Neon](https://neon.tech)).

```bash
# 1. Installer les dépendances (génère aussi le client Prisma)
npm install

# 2. Configurer l'environnement
cp .env.example .env
# puis renseigner DATABASE_URL dans .env

# 3. Créer les tables et charger les 19 montres de test
npm run db:migrate
npm run db:seed

# 4. Lancer le site
npm run dev
```

Puis ouvrir :

- http://localhost:3000 : accueil
- http://localhost:3000/montres : catalogue avec filtres et tri
- http://localhost:3000/montres/tissot-prx-powermatic-80-40mm-bleu : exemple de fiche produit
- http://localhost:3000/marques : pages marques
- http://localhost:3000/design-system : couleurs, typographies et composants
- http://localhost:3000/api/sante : doit répondre `{"ok":true,"base":"connectée"}`

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production (le build lit la base) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Génère les types des routes, puis vérifie TypeScript |
| `npm test` | Tests unitaires (Vitest) |
| `npm run format` | Formatage Prettier |
| `npm run db:migrate` | Créer et appliquer une migration (développement) |
| `npm run db:deploy` | Appliquer les migrations (production, CI) |
| `npm run db:seed` | Recharger le jeu de données de test (vide d'abord le catalogue) |
| `npm run db:studio` | Explorer la base dans le navigateur |
| `npm run admin:promouvoir -- e-mail` | Donner le rôle admin à un compte (`--retirer` pour l'enlever) |
| `npm run visuels` | Régénérer les illustrations SVG des montres de test |

La CI rejoue ces étapes à chaque pull request : formatage, lint, types, tests, puis migrations, données de test et build sur un PostgreSQL 16.

## Notes de versions

- **Next.js 16** : `middleware.ts` s'appelle désormais `proxy.ts` (il protège `/compte` et `/admin`). Les « Cache Components » sont activés : une valeur variable (date, requête) doit être mise en cache ou lue à la demande.
- **Tailwind CSS 4** : plus de `tailwind.config.ts`, la charte est déclarée dans `src/app/globals.css` (bloc `@theme`).
- **Prisma 7** : l'URL de la base est dans `prisma.config.ts`, le client est généré dans `src/generated/prisma` et se connecte via l'adaptateur `pg`.

## Images

Les montres de test sont illustrées par des photos libres de droits (Wikimedia Commons en priorité), avec leurs auteurs et licences dans [docs/credits-photos.md](docs/credits-photos.md). Aucune photo issue des sites des marques n'est utilisée.
