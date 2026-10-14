# Maison Cadran

Boutique en ligne sur mesure de montres de « luxe accessible » (100 € à 2 000 €), pour le marché français.

Stack prévue : Next.js (App Router) + TypeScript + Tailwind CSS, PostgreSQL (Neon) + Prisma, Stripe, Auth.js, Cloudinary, Resend, Vercel.

## Avancement

| Étape | Contenu | Statut |
|---|---|---|
| 0 | Cadrage : arborescence, schéma de base de données, charte graphique | Validée |
| 1 | Setup du projet + design system | En revue (PR #1) |
| 2 | Catalogue + fiche produit | En revue |
| 3 | Panier + checkout Stripe (test) | À venir |
| 4 | Comptes clients | À venir |
| 5 | Back-office admin | À venir |
| 6 | Pages légales, SEO, optimisations, déploiement | À venir |

Le cadrage complet est dans [docs/etape-0.md](docs/etape-0.md).

## Démarrer en local

Prérequis : Node.js 22 ou plus récent, et une base PostgreSQL (locale, ou une base gratuite sur [Neon](https://neon.tech)).

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

- http://localhost:3000 : accueil (nouveautés, collections, montres les plus appréciées)
- http://localhost:3000/montres : catalogue avec filtres et tri
- http://localhost:3000/montres/tissot-prx-powermatic-80-40mm-bleu : exemple de fiche produit
- http://localhost:3000/marques : pages marques
- http://localhost:3000/design-system : référence des couleurs, typographies et composants
- http://localhost:3000/api/sante : doit répondre `{"ok":true,"base":"connectée"}`

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` / `npm run typecheck` | ESLint et TypeScript |
| `npm test` | Tests unitaires (Vitest) |
| `npm run format` | Formatage Prettier |
| `npm run db:migrate` | Créer et appliquer une migration (développement) |
| `npm run db:deploy` | Appliquer les migrations (production) |
| `npm run db:seed` | Recharger le jeu de données de test (vide d'abord le catalogue) |
| `npm run db:studio` | Explorer la base dans le navigateur |
| `npm run visuels` | Régénérer les illustrations SVG des montres de test |

## Versions et écarts avec l'étape 0

- **Next.js 16** : le fichier `middleware.ts` s'appelle désormais `proxy.ts` (il arrivera en phase 4). Les « Cache Components » sont activés : une valeur variable (date, requête) doit être mise en cache ou lue à la demande.
- **Tailwind CSS 4** : plus de `tailwind.config.ts`, la charte est déclarée dans `src/app/globals.css` (bloc `@theme`).
- **Prisma 7** (dernière version stable) : l'URL de la base est dans `prisma.config.ts`, le client est généré dans `src/generated/prisma` et se connecte via l'adaptateur `pg`.

## Catalogue (phase 2)

- **Filtres dans l'URL** : `/montres?marque=tissot,seiko&mouvement=automatique&tri=prix-croissant`. Une recherche se partage et se met en favori. Les combinaisons de filtres ont pour URL canonique la page principale, pour éviter le contenu dupliqué.
- **Compteurs** : chaque option indique le nombre de résultats obtenus en la cochant, en tenant compte des autres filtres.
- **Logique** dans `src/lib/filtres.ts` (pure, testée) ; lectures base mises en cache dans `src/lib/catalogue.ts` (étiquette `catalogue`, à invalider depuis l'admin en phase 5). Le filtrage se fait en mémoire sur un index léger : adapté jusqu'à quelques milliers de références.
- **Images** : en attendant les photos, chaque montre a trois illustrations SVG (face, détail, profil) générées depuis ses vraies caractéristiques, dans `public/images/montres`. Cloudinary les remplacera en phase 5.
- **SEO** : données structurées `Product` (prix, disponibilité, avis) et `BreadcrumbList` sur chaque fiche, métadonnées par page.
