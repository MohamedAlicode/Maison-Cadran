// Validation des variables d'environnement au démarrage.
// L'application refuse de démarrer si une variable obligatoire manque ou est invalide.
import "server-only";
import { z } from "zod";

const schemaEnv = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  NEXT_PUBLIC_SITE_URL: z.url(),
  // Clés des phases suivantes : optionnelles tant que la fonctionnalité n'existe pas.
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  /** Signe les jetons des liens de connexion. Générer avec `openssl rand -base64 33`. */
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  /** Expéditeur des e-mails, sur un domaine vérifié chez Resend. */
  EMAIL_EXPEDITEUR: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const resultat = schemaEnv.safeParse(process.env);

if (!resultat.success) {
  console.error(
    "Variables d'environnement invalides :",
    z.flattenError(resultat.error).fieldErrors,
  );
  throw new Error("Configuration invalide : vérifiez votre fichier .env (voir .env.example).");
}

export const env = resultat.data;
