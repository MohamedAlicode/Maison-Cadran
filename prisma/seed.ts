// Remplit la base avec le jeu de données de test (marques, montres, collections).
// Aucun avis : ils sont déposés depuis la fiche produit, jamais inventés.
// Usage : npm run db:seed (ou automatiquement après `prisma migrate reset`).
// Le script vide d'abord le catalogue : il refuse donc de tourner en production.
// Avec --si-vide (déploiement de la démo), il ne vide rien et ne remplit qu'une base neuve.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { collections, marques, montres } from "./donnees-test";
import { photosMontres } from "../src/lib/photos-montres";

const siVide = process.argv.includes("--si-vide");

if (process.env.NODE_ENV === "production" && !siVide) {
  throw new Error("Le seed de test ne doit jamais être lancé en production.");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const JOUR = 24 * 60 * 60 * 1000;
const maintenant = Date.now();

async function main() {
  if (siVide && (await db.brand.count()) > 0) {
    console.log("Catalogue déjà rempli : rien à faire.");
    return;
  }

  // Vidage dans l'ordre des dépendances
  await db.$transaction([
    db.review.deleteMany(),
    db.wishlistItem.deleteMany(),
    db.productCollection.deleteMany(),
    db.productImage.deleteMany(),
    db.product.deleteMany(),
    db.collection.deleteMany(),
    db.brand.deleteMany(),
  ]);

  const idsMarques = new Map<string, { id: string; name: string }>();
  for (const [i, marque] of marques.entries()) {
    const creee = await db.brand.create({ data: { ...marque, sortOrder: i } });
    idsMarques.set(marque.slug, { id: creee.id, name: creee.name });
  }

  const idsCollections = new Map<string, string>();
  for (const [i, collection] of collections.entries()) {
    const creee = await db.collection.create({ data: { ...collection, sortOrder: i } });
    idsCollections.set(collection.slug, creee.id);
  }

  for (const montre of montres) {
    const { marque, collections: slugsCollections = [], ancienneteJours, ...champs } = montre;
    const infosMarque = idsMarques.get(marque)!;
    const date = new Date(maintenant - ancienneteJours * JOUR);
    await db.product.create({
      data: {
        ...champs,
        status: "PUBLISHED",
        brandId: infosMarque.id,
        createdAt: date,
        images: {
          create: photosMontres
            .filter((photo) => photo.produit === montre.slug)
            .map((photo, position) => ({
              publicId: `test/${photo.url.split("/").pop()}`,
              url: photo.url,
              alt: `${infosMarque.name} ${montre.name}, ${photo.vue}`,
              width: photo.taille,
              height: photo.taille,
              position,
            })),
        },
        collections: {
          create: slugsCollections.map((slug, position) => ({
            collectionId: idsCollections.get(slug)!,
            position,
          })),
        },
      },
    });
  }

  console.log(
    `Seed terminé : ${marques.length} marques, ${montres.length} montres, ${collections.length} collections.`,
  );
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
