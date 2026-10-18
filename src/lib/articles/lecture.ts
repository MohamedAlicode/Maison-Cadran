// Articles publiés du guide, mis en cache et invalidés par l'étiquette « articles ».
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export async function articlesPublies() {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return db.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, coverUrl: true, coverAlt: true },
  });
}

export async function articleParSlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return db.article.findFirst({ where: { slug, publishedAt: { not: null } } });
}
