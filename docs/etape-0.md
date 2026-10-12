# Étape 0 : cadrage de la boutique de montres

> Statut : **en attente de validation de Boss**. Aucune ligne de code de la phase 1 ne sera écrite avant ton feu vert.
>
> Les valeurs marquées **[PAR DÉFAUT]** sont provisoires : elles me permettent d'avancer et se changent en une ligne (fichier `src/config/boutique.ts`).

Sommaire

1. [Questions ouvertes](#1-questions-ouvertes)
2. [Ce que je retiens des sites d'inspiration](#2-ce-que-je-retiens-des-sites-dinspiration)
3. [Stack : validation et ajustements](#3-stack--validation-et-ajustements)
4. [Arborescence du projet](#4-arborescence-du-projet)
5. [Plan du site (URLs)](#5-plan-du-site-urls)
6. [Schéma de base de données](#6-schéma-de-base-de-données)
7. [Règles métier clés](#7-règles-métier-clés)
8. [Charte graphique](#8-charte-graphique)
9. [Découpage des phases](#9-découpage-des-phases)

---

## 1. Questions ouvertes

| # | Question | Ma recommandation | Valeur par défaut utilisée |
|---|---|---|---|
| 1 | Nom de la boutique ? | Un nom court, francophone, évoquant le temps sans citer de marque (risque de conflit de marque). Pistes : *Maison Cadran*, *L'Heure Juste*, *Atelier Laiton*. | **[PAR DÉFAUT] « Maison Cadran »** |
| 2 | Vraie boutique ou démo ? | Construire comme une vraie boutique (même niveau d'exigence), mais lancer en mode test Stripe. Le passage en production devient une simple bascule de clés. | **[PAR DÉFAUT] Vraie boutique, en mode test** |
| 3 | Seuil de livraison gratuite ? | 150 € : avec un panier moyen de 100 à 2 000 €, presque toutes les commandes sont offertes, ce qui rassure sans coûter cher. En dessous : 9,90 € en Colissimo signature. | **[PAR DÉFAUT] 150 €** |
| 4 | Es-tu revendeur agréé des marques visées ? | Point juridique important : la mention « garantie constructeur » et l'usage des logos ne sont possibles que via le réseau de distribution officiel. Sinon, il faut une garantie boutique et des mentions adaptées (marché parallèle). | **[PAR DÉFAUT] Revendeur agréé** (textes à ajuster sinon) |
| 5 | Neuf uniquement, ou aussi occasion / seconde main ? | Neuf uniquement pour la V1. Le schéma prévoit un champ `condition` pour ajouter l'occasion plus tard sans migration lourde. | **[PAR DÉFAUT] Neuf uniquement** |
| 6 | Livraison hors France métropolitaine (DOM, UE) ? | France métropolitaine en V1, la TVA et les frais restent simples. | **[PAR DÉFAUT] France métropolitaine** |
| 7 | Paiement en plusieurs fois ? | Klarna via Stripe (3x / 4x, disponible en France, aucune intégration supplémentaire). Alternative française : Alma, mais intégration séparée. | **[PAR DÉFAUT] Klarna via Stripe** |
| 8 | Préférence palette : sombre ou crème ? | Crème en fond principal (plus lisible, met en valeur les photos sur fond blanc), avec des sections sombres ponctuelles (hero, pied de page). Voir §8. | **[PAR DÉFAUT] Crème + touches sombres** |

---

## 2. Ce que je retiens des sites d'inspiration

| Site | Ce qui fonctionne | Ce que j'applique |
|---|---|---|
| **Hodinkee Shop** | Ton éditorial, chaque montre est racontée. Photos très soignées, souvent portées. Contenu (articles) et boutique mélangés. | Un bloc « L'avis de la maison » sur chaque fiche produit, et des liens croisés guide d'achat ↔ produits. Photos portées en 2e image de galerie. |
| **Watchfinder** | Réassurance omniprésente : authenticité, garantie, centre de service, avis. Fiches très complètes, prix clairs. | Bandeau de réassurance sous le header et sur chaque fiche (authenticité, garantie, retours 14 j, paiement sécurisé). Bloc « Ce qui est inclus » (écrin, papiers, garantie). |
| **Chrono24** | Filtres très riches et rapides, compteurs de résultats par option, filtres actifs visibles en « puces » supprimables. | Filtres à facettes avec compteurs, puces de filtres actifs, état des filtres dans l'URL (partageable, indexable pour les combinaisons utiles). Tiroir de filtres plein écran sur mobile. |
| **Mr Porter** | UX premium : beaucoup d'espace, typographie forte, navigation simple, ajout au panier fluide (mini-panier latéral), service client mis en avant. | Mini-panier en tiroir latéral, méga-menu sobre, grandes images, transitions douces. Contact visible dans le pied de page et sur la fiche. |
| **Tissot / Hamilton (officiels)** | Fiches techniques exhaustives et structurées (calibre, réserve de marche, verre, étanchéité, dimensions). Zoom haute définition, vues multiples. | Tableau de caractéristiques groupé par rubriques (Boîtier, Mouvement, Cadran, Bracelet), zoom au survol sur desktop et plein écran avec pincement sur mobile. |

Ce que j'évite : les pop-ups d'inscription agressives, les comptes à rebours de fausse urgence et les carrousels automatiques, qui nuisent à l'image haut de gamme.

---

## 3. Stack : validation et ajustements

La stack proposée est la bonne pour ce cas. Je la garde, avec ces précisions :

| Brique | Choix | Commentaire |
|---|---|---|
| Framework | Next.js (App Router, dernière version stable) + TypeScript strict | Server Components pour le SEO et la performance, Server Actions pour les formulaires. |
| Style | Tailwind CSS + composants maison | Pas de bibliothèque UI lourde. J'utilise **Radix UI** (primitives accessibles, sans style) pour les tiroirs, menus, dialogues et accordéons, ce qui règle la navigation clavier. |
| Base | PostgreSQL + Prisma, hébergée sur **Neon** | Neon plutôt que Supabase : on n'utilise que Postgres (Auth.js gère l'auth, Cloudinary les images), Neon est plus simple et a des branches de base par preview Vercel. |
| Recherche / filtres | Postgres seul | Suffisant jusqu'à plusieurs milliers de produits. Meilisearch ou Algolia restent ajoutables plus tard si besoin. |
| Paiement | Stripe Checkout (hébergé) + webhooks | CB, Apple Pay, Google Pay, Klarna activés depuis le tableau de bord Stripe. Checkout hébergé = moins de surface PCI et 3-D Secure géré. |
| Auth | Auth.js v5 : lien magique par email (Resend) + Google | Pas de mot de passe à stocker en V1 : plus sûr et moins de friction. Achat possible sans compte (invité). |
| Images | Cloudinary + `next/image` | Transformations à la volée (AVIF/WebP, recadrage), upload signé depuis l'admin. |
| Emails | Resend + **React Email** | Gabarits d'email écrits en composants React, cohérents avec la charte. |
| Facture PDF | **@react-pdf/renderer**, générée côté serveur | Numérotation séquentielle continue (obligation légale), PDF stocké et joint à l'email. |
| Validation | Zod partout (formulaires, Server Actions, webhooks, variables d'environnement) | Les variables d'environnement sont validées au démarrage : l'app refuse de démarrer si une clé manque. |
| Consentement cookies | Bandeau maison conforme CNIL | « Refuser » aussi visible qu'« Accepter », aucun traceur avant consentement. Analytics : **Plausible** ou Vercel Analytics (sans cookie), ce qui simplifie le RGPD. |
| Tests | Vitest (logique métier : prix, TVA, stock) + Playwright (parcours d'achat) | Ciblés sur ce qui coûte cher en cas de bug. |
| Qualité | ESLint, Prettier, TypeScript strict, Husky | |

Seul changement par rapport au brief : rien de structurel, uniquement des choix précis là où le brief laissait « ou équivalent ».

---

## 4. Arborescence du projet

```
maison-cadran/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                      # 15-20 montres réalistes (phase 2)
├── public/
│   ├── fonts/                       # (si auto-hébergement des polices)
│   └── images/placeholders/
├── emails/                          # Gabarits React Email
│   ├── confirmation-commande.tsx
│   ├── commande-expediee.tsx
│   └── lien-connexion.tsx
├── src/
│   ├── app/
│   │   ├── (boutique)/              # Site public, layout avec header/footer
│   │   │   ├── page.tsx             # Accueil
│   │   │   ├── montres/
│   │   │   │   ├── page.tsx         # Catalogue + filtres
│   │   │   │   └── [slug]/page.tsx  # Fiche produit
│   │   │   ├── marques/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── collections/[slug]/page.tsx
│   │   │   ├── guide/
│   │   │   │   ├── page.tsx         # Liste des articles
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── panier/page.tsx
│   │   │   ├── commande/
│   │   │   │   ├── confirmation/page.tsx
│   │   │   │   └── annulee/page.tsx
│   │   │   ├── compte/
│   │   │   │   ├── page.tsx         # Tableau de bord client
│   │   │   │   ├── commandes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [numero]/page.tsx
│   │   │   │   ├── adresses/page.tsx
│   │   │   │   └── favoris/page.tsx
│   │   │   ├── connexion/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── (legal)/
│   │   │       ├── cgv/page.tsx
│   │   │       ├── mentions-legales/page.tsx
│   │   │       ├── confidentialite/page.tsx
│   │   │       ├── cookies/page.tsx
│   │   │       └── retours/page.tsx
│   │   ├── admin/                   # Back-office, protégé par rôle
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Tableau de bord (CA, commandes, top ventes)
│   │   │   ├── produits/
│   │   │   ├── marques/
│   │   │   ├── collections/
│   │   │   ├── commandes/
│   │   │   ├── codes-promo/
│   │   │   ├── avis/                # Modération des avis
│   │   │   └── articles/            # Guide d'achat / blog
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhooks/stripe/route.ts
│   │   │   ├── factures/[numero]/route.ts   # Téléchargement PDF (contrôle d'accès)
│   │   │   └── cloudinary/signature/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── layout.tsx               # Polices, métadonnées globales, bandeau cookies
│   │   ├── not-found.tsx
│   │   └── globals.css              # Variables CSS de la charte
│   ├── components/
│   │   ├── ui/                      # Design system : Button, Input, Select, Badge, Drawer…
│   │   ├── layout/                  # Header, MegaMenu, Footer, ReassuranceBar
│   │   ├── catalogue/               # ProductCard, FilterPanel, ActiveFilters, SortSelect
│   │   ├── produit/                 # Gallery, ZoomViewer, SpecsTable, StockInfo, Reviews
│   │   ├── panier/                  # CartDrawer, CartLine, CartSummary
│   │   ├── compte/
│   │   ├── admin/
│   │   └── seo/                     # JsonLd (Product, Organization, BreadcrumbList)
│   ├── config/
│   │   └── boutique.ts              # Nom, seuil livraison, frais, coordonnées, TVA
│   ├── lib/
│   │   ├── db.ts                    # Client Prisma (singleton)
│   │   ├── auth.ts                  # Configuration Auth.js + garde de rôle
│   │   ├── stripe.ts
│   │   ├── cloudinary.ts
│   │   ├── resend.ts
│   │   ├── env.ts                   # Validation Zod des variables d'environnement
│   │   ├── prix.ts                  # Calculs en centimes : HT/TVA/TTC, remises, livraison
│   │   ├── stock.ts                 # Décrément transactionnel après paiement
│   │   ├── facture.tsx              # Génération PDF
│   │   ├── filtres.ts               # Parsing URL ↔ filtres (Zod) ↔ requête Prisma
│   │   └── utils.ts                 # formatPrix, slugify…
│   ├── server/
│   │   ├── actions/                 # Server Actions (panier, compte, admin)
│   │   └── queries/                 # Lectures BDD réutilisables
│   ├── schemas/                     # Schémas Zod partagés (produit, adresse, commande…)
│   └── types/
├── tests/
│   ├── unit/                        # Vitest
│   └── e2e/                         # Playwright
├── .env.example
├── middleware.ts                    # Protection /compte et /admin
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 5. Plan du site (URLs)

URLs en français, courtes et stables.

| Page | URL |
|---|---|
| Accueil | `/` |
| Catalogue | `/montres` |
| Catalogue filtré | `/montres?marque=tissot&mouvement=automatique&prix=500-1000` |
| Fiche produit | `/montres/tissot-prx-powermatic-80-40mm-bleu` |
| Marques | `/marques`, `/marques/hamilton` |
| Collections | `/collections/montres-de-plongee` |
| Guide d'achat | `/guide`, `/guide/choisir-sa-premiere-montre-automatique` |
| Panier, confirmation | `/panier`, `/commande/confirmation?session_id=…` |
| Compte | `/compte`, `/compte/commandes/MC-2026-000123`, `/compte/adresses`, `/compte/favoris` |
| Légal | `/cgv`, `/mentions-legales`, `/confidentialite`, `/cookies`, `/retours` |
| Service | `/faq`, `/contact` |

SEO : les pages marques et collections servent de pages d'atterrissage indexables (ex. « montres Hamilton automatiques »). Les combinaisons de filtres arbitraires sont en `noindex` avec une URL canonique vers `/montres`, pour éviter le contenu dupliqué.

---

## 6. Schéma de base de données

Principes :
- **Prix en centimes (entiers)**, jamais de flottants. Les prix sont TTC (ce que voit le client) ; HT et TVA sont recalculés côté serveur.
- Les **commandes figent un instantané** (nom, référence, prix, adresse) : modifier un produit ne réécrit jamais l'historique ni une facture.
- Caractéristiques filtrables en **colonnes typées et enums**, pas en JSON, pour des filtres rapides et sûrs.
- Le stock est sur le produit (une montre = une référence ; pas de variantes de taille en V1). Si un modèle existe en plusieurs cadrans, ce sont des produits distincts reliés par `familyKey` (affichés comme « Autres coloris »).

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────── Enums ───────────────────────────

enum Role {
  CUSTOMER
  ADMIN
}

enum Gender {
  HOMME
  FEMME
  MIXTE
}

enum Movement {
  AUTOMATIQUE
  MANUEL
  QUARTZ
  SOLAIRE
  KINETIQUE
}

enum CaseMaterial {
  ACIER
  TITANE
  CERAMIQUE
  OR
  PLAQUE_OR
  BRONZE
  AUTRE
}

enum StrapType {
  ACIER
  CUIR
  CAOUTCHOUC
  NATO_TISSU
  TITANE
  AUTRE
}

enum Condition {
  NEUF
  OCCASION
}

enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum OrderStatus {
  PENDING    // Session Stripe créée, paiement non confirmé
  PAID       // Payée (webhook reçu)
  PREPARING  // Préparée
  SHIPPED    // Expédiée
  DELIVERED  // Livrée
  REFUNDED   // Remboursée
  CANCELLED  // Abandonnée / expirée
}

enum DiscountType {
  PERCENT
  FIXED     // Montant en centimes
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

// ─────────────────────────── Auth.js ───────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  role          Role      @default(CUSTOMER)
  marketingOptIn Boolean  @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  addresses Address[]
  orders    Order[]
  wishlist  WishlistItem[]
  reviews   Review[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─────────────────────────── Catalogue ───────────────────────────

model Brand {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?  @db.Text
  history     String?  @db.Text      // Contenu éditorial de la page marque (SEO)
  logoUrl     String?
  country     String?
  foundedYear Int?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products Product[]
}

model Collection {
  id          String   @id @default(cuid())
  name        String                  // « Montres de plongée », « Idées cadeaux »
  slug        String   @unique
  description String?  @db.Text
  imageUrl    String?
  isFeatured  Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products ProductCollection[]
}

model Product {
  id          String        @id @default(cuid())
  slug        String        @unique
  name        String                       // « PRX Powermatic 80 »
  reference   String        @unique        // Référence fabricant, ex. T137.407.11.041.00
  brandId     String
  familyKey   String?                      // Regroupe les déclinaisons de cadran
  status      ProductStatus @default(DRAFT)
  condition   Condition     @default(NEUF)

  // Contenu
  shortDescription String
  description      String   @db.Text
  editorialNote    String?  @db.Text       // « L'avis de la maison »

  // Prix (centimes, TTC)
  priceCents        Int
  compareAtCents    Int?                   // Prix barré éventuel
  vatRate           Int     @default(2000) // 20,00 % en points de base

  // Stock et logistique
  stock             Int     @default(0)
  lowStockThreshold Int     @default(2)
  leadTimeDays      Int     @default(2)    // Délai d'expédition affiché
  warrantyMonths    Int     @default(24)

  // Caractéristiques filtrables
  gender          Gender
  movement        Movement
  caliber         String?                  // « Powermatic 80.111 »
  powerReserveH   Int?
  caseDiameterMm  Decimal  @db.Decimal(4, 1)
  caseThicknessMm Decimal? @db.Decimal(4, 1)
  lugWidthMm      Int?
  caseMaterial    CaseMaterial
  strapType       StrapType
  strapColor      String?
  dialColor       String                   // Valeur normalisée : bleu, noir, blanc, vert…
  waterResistanceM Int                     // 50, 100, 200…
  crystal         String?                  // « Saphir », « Minéral »
  functions       String[]                 // Date, chronographe, GMT…

  // SEO
  metaTitle       String?
  metaDescription String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  brand       Brand               @relation(fields: [brandId], references: [id])
  images      ProductImage[]
  collections ProductCollection[]
  orderItems  OrderItem[]
  wishlistedBy WishlistItem[]
  reviews     Review[]

  @@index([status, brandId])
  @@index([status, priceCents])
  @@index([movement])
  @@index([gender])
  @@index([familyKey])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  publicId  String                 // Identifiant Cloudinary
  url       String
  alt       String                 // Obligatoire (accessibilité)
  width     Int
  height    Int
  position  Int     @default(0)    // 0 = image principale

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, position])
}

model ProductCollection {
  productId    String
  collectionId String
  position     Int @default(0)

  product    Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([productId, collectionId])
}

// ─────────────────────────── Clients ───────────────────────────

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String?                // « Maison », « Bureau »
  firstName  String
  lastName   String
  company    String?
  line1      String
  line2      String?
  postalCode String
  city       String
  country    String  @default("FR")
  phone      String                 // Requis pour la livraison avec signature
  isDefault  Boolean @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model WishlistItem {
  userId    String
  productId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@id([userId, productId])
}

model Review {
  id               String       @id @default(cuid())
  productId        String
  userId           String
  orderId          String?                  // Renseigné = « Achat vérifié »
  rating           Int                      // 1 à 5 (validé par Zod)
  title            String?
  body             String       @db.Text
  status           ReviewStatus @default(PENDING)
  createdAt        DateTime     @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([productId, userId])
  @@index([productId, status])
}

// ─────────────────────────── Commandes ───────────────────────────

model Order {
  id      String      @id @default(cuid())
  number  String      @unique              // MC-2026-000123 (lisible client)
  userId  String?                          // Null si achat invité
  email   String
  status  OrderStatus @default(PENDING)

  // Montants figés (centimes, TTC sauf mention)
  subtotalCents  Int
  discountCents  Int     @default(0)
  shippingCents  Int     @default(0)
  totalCents     Int
  vatCents       Int                        // TVA incluse dans le total
  currency       String  @default("eur")

  discountCodeId String?
  discountCode   String?                    // Code figé au moment de l'achat

  // Adresses figées (JSON validé par Zod, instantané immuable)
  shippingAddress Json
  billingAddress  Json

  // Stripe
  stripeCheckoutSessionId String? @unique
  stripePaymentIntentId   String? @unique
  paymentMethodType       String?           // card, klarna…

  // Logistique
  carrier        String?
  trackingNumber String?
  trackingUrl    String?

  // Horodatage des statuts
  paidAt      DateTime?
  preparedAt  DateTime?
  shippedAt   DateTime?
  deliveredAt DateTime?
  refundedAt  DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User?         @relation(fields: [userId], references: [id], onDelete: SetNull)
  discount DiscountCode? @relation(fields: [discountCodeId], references: [id], onDelete: SetNull)
  items    OrderItem[]
  invoice  Invoice?
  events   OrderEvent[]

  @@index([userId])
  @@index([status, createdAt])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String?                       // Null si le produit est supprimé plus tard

  // Instantané produit
  productName    String
  brandName      String
  reference      String
  imageUrl       String?
  unitPriceCents Int
  vatRate        Int
  quantity       Int

  order   Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@index([productId])
}

model OrderEvent {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  actorId   String?                        // Admin ayant changé le statut
  createdAt DateTime    @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId, createdAt])
}

model Invoice {
  id        String   @id @default(cuid())
  orderId   String   @unique
  number    String   @unique              // F-2026-000001, séquence continue sans trou
  sequence  Int      @unique
  pdfUrl    String?
  issuedAt  DateTime @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Restrict)
}

model DiscountCode {
  id             String       @id @default(cuid())
  code           String       @unique     // Stocké en majuscules
  type           DiscountType
  value          Int                      // % (ex. 10) ou centimes
  minOrderCents  Int?
  maxUses        Int?
  usesCount      Int          @default(0)
  perCustomerMax Int?         @default(1)
  startsAt       DateTime?
  endsAt         DateTime?
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())

  orders Order[]
}

// ─────────────────────────── Contenu ───────────────────────────

model Article {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  excerpt     String
  content     String    @db.Text          // Markdown (MDX en option)
  coverUrl    String?
  coverAlt    String?
  publishedAt DateTime?
  metaTitle       String?
  metaDescription String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// Webhooks Stripe déjà traités (idempotence)
model StripeEvent {
  id          String   @id                // evt_… fourni par Stripe
  type        String
  processedAt DateTime @default(now())
}
```

Le panier n'est pas en base en V1 : il vit dans un cookie signé (identifiants + quantités seulement). Les prix et le stock sont toujours relus en base côté serveur à l'affichage et à la création du paiement.

---

## 7. Règles métier clés

**Prix et TVA**
- Le client ne transmet jamais un prix : il envoie `productId` + `quantité`, le serveur recalcule tout (`src/lib/prix.ts`).
- TVA 20 % incluse : `TVA = TTC − round(TTC / 1,2)`, calculée par ligne puis sommée, affichée sur le panier et la facture.

**Paiement et stock**
1. Au clic « Payer » : validation Zod, contrôle du stock disponible, recalcul des montants, création d'une `Order` en `PENDING`, puis d'une session Stripe Checkout avec ces montants.
2. Webhook `checkout.session.completed` : vérification de la signature, idempotence via `StripeEvent`, puis **dans une transaction** : décrément conditionnel du stock (`UPDATE … WHERE stock >= quantité`), passage en `PAID`, attribution du numéro de facture, incrément du code promo.
3. Si le stock est passé à zéro entre-temps (deux clients sur la dernière pièce) : la commande est marquée, l'admin est alerté et le remboursement est déclenché automatiquement avec un email d'excuse. Rare, mais géré.
4. Session expirée (`checkout.session.expired`) : commande passée en `CANCELLED`.

**Livraison**
- Colissimo avec remise contre signature et assurance, 9,90 € sous le seuil, offerte dès **150 € [PAR DÉFAUT]**.
- Délai affiché sur la fiche : « Expédiée sous X jours ouvrés, livrée en 48 h ».

**Retours**
- 14 jours de rétractation légale (le texte prévoit la condition « montre non portée, film de protection et scellés intacts » pour l'état du produit, à valider juridiquement).

**Sécurité**
- `/admin` protégé dans le middleware ET dans chaque Server Action admin (double vérification du rôle).
- Facture téléchargeable seulement par son propriétaire ou un admin.
- Limitation de débit sur le formulaire de contact et l'envoi de liens de connexion.

---

## 8. Charte graphique

### Intention
Une boutique d'horloger indépendant : calme, précise, chaleureuse. Le produit est la star ; l'interface s'efface. Le laiton souligne, il ne décore pas.

### Couleurs

| Rôle | Nom | Valeur | Usage |
|---|---|---|---|
| Fond principal | Crème | `#F7F3EC` | Fond de page |
| Surface | Ivoire | `#FFFDF9` | Cartes produit, champs |
| Fond photo | Blanc pur | `#FFFFFF` | Arrière-plan des photos produit |
| Texte principal | Encre | `#1C1B19` | Titres, texte (contraste 16:1 sur crème) |
| Texte secondaire | Graphite | `#5E5A53` | Légendes, métadonnées (contraste 6,2:1) |
| Bordures | Sable | `#E4DDD1` | Séparateurs, contours |
| Accent | Laiton | `#B08D57` | Filets, icônes, soulignements, états actifs (décoratif, pas de petit texte) |
| Accent texte | Laiton foncé | `#7A5C26` | Liens et petits textes dorés (contraste 5,6:1, conforme AA) |
| Sections sombres | Nuit | `#14161A` | Hero, pied de page, bandeaux éditoriaux |
| Texte sur sombre | Crème | `#F7F3EC` | |
| Accent sur sombre | Laiton clair | `#C9A86A` | |
| Succès | Sauge | `#3E6B4F` | En stock, confirmation |
| Alerte | Ambre | `#9A5B13` | Stock faible |
| Erreur | Bordeaux | `#9B2C2C` | Erreurs de formulaire |

Règle : 90 % crème/ivoire/blanc, 8 % encre/nuit, 2 % laiton.

### Typographies (Google Fonts via `next/font`, auto-hébergées, sans impact sur la performance)

| Rôle | Police | Détails |
|---|---|---|
| Titres | **Cormorant Garamond** (500, 600) | Serif élégante à fort contraste. H1 48-64 px desktop / 36 px mobile, interlignage 1,1, léger espacement négatif. |
| Texte, UI | **Inter** (400, 500, 600) | Très lisible, chiffres tabulaires pour les prix et caractéristiques. Corps 16 px, interlignage 1,6. |
| Sur-titres | Inter 500, capitales, espacement +0,14 em, 12 px | « NOUVEAUTÉS », « AUTOMATIQUE », noms de marques sur les cartes. |

Alternative si tu préfères plus contemporain : **Fraunces** (titres) + **Manrope** (texte).

Échelle : 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 px.

### Espacements et grille
- Échelle de 4 px ; sections espacées de 96-128 px desktop, 64 px mobile.
- Conteneur max 1 440 px, marges 24 px mobile / 48 px desktop.
- Grille catalogue : 2 colonnes mobile, 3 tablette, 4 desktop.
- Coins : 2 px (presque droits, plus « joaillerie » que des coins arrondis).
- Ombres : quasi absentes ; on préfère les filets fins `1px` sable.

### Composants clés

| Composant | Description |
|---|---|
| **Bouton principal** | Fond encre, texte crème, capitales espacées 13 px, hauteur 48 px. Survol : fond nuit + filet laiton qui se dessine sous le texte (200 ms). |
| **Bouton secondaire** | Contour encre 1 px, fond transparent. Survol : fond encre, texte crème. |
| **Lien texte** | Souligné laiton qui s'étend de gauche à droite au survol. |
| **Carte produit** | Photo carrée sur fond blanc, marque en sur-titre, nom en serif, prix en Inter tabulaire. Survol : 2e photo en fondu (400 ms), cœur favori discret. Badges : « Nouveau », « Dernière pièce ». |
| **Bandeau réassurance** | 4 icônes au trait fin laiton + libellés courts : Authenticité garantie · Garantie 2 ans · Livraison assurée offerte dès 150 € · Retours 14 jours. |
| **Panneau de filtres** | Accordéons (Radix), cases à cocher carrées, compteurs gris, curseur de prix double. Mobile : tiroir plein écran avec bouton « Voir 42 montres ». |
| **Puces de filtres actifs** | Contour sable, croix de suppression, lien « Tout effacer ». |
| **Galerie produit** | Grande image + vignettes verticales (desktop) ou carrousel avec points (mobile). Zoom loupe au survol, plein écran au clic. |
| **Tableau de caractéristiques** | Deux colonnes, libellés graphite, valeurs encre, regroupé par rubrique, filets sable. |
| **Mini-panier** | Tiroir latéral droit, liste des articles, barre de progression « Plus que 32 € pour la livraison offerte », total, bouton principal. |
| **Champs de formulaire** | Fond ivoire, bordure sable, focus : bordure encre + anneau laiton 2 px (visible au clavier). |
| **Bandeau cookies** | Bas d'écran, fond nuit, trois boutons de même poids : Accepter · Refuser · Personnaliser. |

### Mouvement
- Durées 150-400 ms, courbe `cubic-bezier(0.2, 0, 0, 1)`.
- Uniquement : fondus, léger glissement (8 px), dessin de filets, échange de photo au survol.
- Respect de `prefers-reduced-motion` : toutes les animations désactivées.

### Iconographie et photo
- Icônes au trait fin 1,5 px (**Lucide**), jamais remplies.
- Photos : fond blanc pur pour le catalogue, mises en situation chaudes pour le hero et l'éditorial. Placeholders en phase 2 : silhouettes de montres neutres générées, cohérentes avec la palette.

---

## 9. Découpage des phases

Rappel de la méthode validée : une phase à la fois, ton feu vert entre chaque.

| Phase | Contenu | Prérequis de ta part |
|---|---|---|
| 1 | Setup Next.js, Tailwind, Prisma, Neon, design system (page de démonstration des composants) | **Un dépôt GitHub** (je peux le créer si tu me donnes accès), un compte Neon |
| 2 | Catalogue, filtres, fiche produit, 15-20 montres de test | Compte Cloudinary (gratuit) |
| 3 | Panier, Stripe Checkout test, webhooks, emails, facture PDF | Compte Stripe (mode test), compte Resend |
| 4 | Comptes clients (lien magique, Google), commandes, adresses, favoris | Identifiants Google OAuth (optionnel) |
| 5 | Back-office admin complet | |
| 6 | Pages légales, SEO, performance, accessibilité, déploiement Vercel | Compte Vercel, informations légales de la société (raison sociale, SIRET, adresse, TVA intracom, hébergeur) |

À chaque phase je livre : le code complet dans le dépôt, les commandes à lancer, et comment tester.
