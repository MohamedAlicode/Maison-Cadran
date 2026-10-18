// Codes promo annoncés dans la banderole : cochés « banderole » au back-office, actifs et
// en cours de validité. Mis en cache une heure au plus, invalidés à chaque enregistrement.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { annonceCode } from "@/lib/panier/codes-promo";

export async function annoncesCodesPromo(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("codes-promo");

  const maintenant = new Date();
  const codes = await db.discountCode.findMany({
    where: {
      showInBanner: true,
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: maintenant } }] },
        { OR: [{ endsAt: null }, { endsAt: { gt: maintenant } }] },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return codes.filter((c) => c.maxUses === null || c.usesCount < c.maxUses).map(annonceCode);
}
