// Point de contrôle de santé : vérifie que l'application joint la base de données.
// Utile après un déploiement : GET /api/sante doit répondre { ok: true }.
import { connection } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  await connection();
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, base: "connectée" });
  } catch {
    return Response.json({ ok: false, base: "injoignable" }, { status: 503 });
  }
}
