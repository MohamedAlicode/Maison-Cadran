# Maison Cadran

Boutique en ligne sur mesure de montres de « luxe accessible » (100 € à 2 000 €), pour le marché français.

Stack prévue : Next.js (App Router) + TypeScript + Tailwind CSS, PostgreSQL (Neon) + Prisma, Stripe, Auth.js, Cloudinary, Resend, Vercel.

## Avancement

| Étape | Contenu | Statut |
|---|---|---|
| 0 | Cadrage : arborescence, schéma de base de données, charte graphique | Validée |
| 1 | Setup du projet + design system | En revue |
| 2 | Catalogue + fiche produit | À venir |
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

# 3. Créer les tables
npm run db:migrate

# 4. Lancer le site
npm run dev
```

Puis ouvrir :

- http://localhost:3000 : accueil (version vitrine du design system)
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
| `npm run db:studio` | Explorer la base dans le navigateur |

## Versions et écarts avec l'étape 0

- **Next.js 16** : le fichier `middleware.ts` s'appelle désormais `proxy.ts` (il arrivera en phase 4). Les « Cache Components » sont activés : une valeur variable (date, requête) doit être mise en cache ou lue à la demande.
- **Tailwind CSS 4** : plus de `tailwind.config.ts`, la charte est déclarée dans `src/app/globals.css` (bloc `@theme`).
- **Prisma 7** (dernière version stable) : l'URL de la base est dans `prisma.config.ts`, le client est généré dans `src/generated/prisma` et se connecte via l'adaptateur `pg`.
