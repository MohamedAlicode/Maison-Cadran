// Ouvre une session Auth.js pour une connexion par mot de passe. Le fournisseur « Credentials »
// d'Auth.js n'accepte que des sessions JWT ; on écrit donc la session en base et son cookie
// comme le fait Auth.js, et auth(), la déconnexion et l'espace client marchent sans changement.
import "server-only";
import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";

// Durée de session par défaut d'Auth.js.
const DUREE_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export async function ouvrirSession(userId: string) {
  const sessionToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + DUREE_SESSION_MS);
  await db.session.create({ data: { sessionToken, userId, expires } });

  // Auth.js préfixe son cookie par « __Secure- » en HTTPS : on suit la même règle pour qu'il le relise.
  const https = (await headers()).get("x-forwarded-proto")?.split(",")[0]?.trim() === "https";
  (await cookies()).set(`${https ? "__Secure-" : ""}authjs.session-token`, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: https,
    expires,
  });
}
