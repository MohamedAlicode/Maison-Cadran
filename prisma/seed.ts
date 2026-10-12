// Remplit la base avec le jeu de données de test (marques, montres, collections, avis).
// Usage : npm run db:seed (ou automatiquement après `prisma migrate reset`).
// Le script vide d'abord le catalogue : il refuse donc de tourner en production.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { cheminVisuel, vuesMontre } from "../src/lib/visuels";
import { avisTest, clientsTest, collections, marques, montres } from "./donnees-test";

if (process.env.NODE_ENV === "production") {
  throw new Error("Le seed de test ne doit jamais être lancé en production.");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const JOUR = 24 * 60 * 60 * 1000;
const maintenant = Date.now();

const nomsVues = { face: "vue de face", detail: "détail du cadran", profil: "vue de profil" };

async function main() {
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

  const idsProduits = new Map<string, string>();
  for (const montre of montres) {
    const { marque, collections: slugsCollections = [], ancienneteJours, ...champs } = montre;
    const infosMarque = idsMarques.get(marque)!;
    const date = new Date(maintenant - ancienneteJours * JOUR);
    const produit = await db.product.create({
      data: {
        ...champs,
        status: "PUBLISHED",
        brandId: infosMarque.id,
        createdAt: date,
        images: {
          create: vuesMontre.map((vue, position) => ({
            publicId: `test/${montre.slug}-${vue}`,
            url: cheminVisuel(montre.slug, vue),
            alt: `${infosMarque.name} ${montre.name}, ${nomsVues[vue]}`,
            width: 800,
            height: 800,
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
    idsProduits.set(montre.slug, produit.id);
  }

  const idsClients = new Map<string, string>();
  for (const client of clientsTest) {
    const utilisateur = await db.user.upsert({
      where: { email: client.email },
      update: { name: client.name },
      create: client,
    });
    idsClients.set(client.email, utilisateur.id);
  }

  for (const avis of avisTest) {
    await db.review.create({
      data: {
        productId: idsProduits.get(avis.produit)!,
        userId: idsClients.get(avis.client)!,
        rating: avis.rating,
        title: avis.title,
        body: avis.body,
        status: "APPROVED",
        createdAt: new Date(maintenant - avis.ancienneteJours * JOUR),
      },
    });
  }

  console.log(
    `Seed terminé : ${marques.length} marques, ${montres.length} montres, ${collections.length} collections, ${avisTest.length} avis.`,
  );
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
