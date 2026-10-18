// Comptes clients avec Auth.js : lien magique par e-mail, et Google quand ses clés existent.
// Les sessions sont stockées en base : se déconnecter ou supprimer une session la coupe aussitôt.
import "server-only";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import { envoyerEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { EmailLienConnexion } from "@/emails/lien-connexion";

/** Durée de validité d'un lien de connexion (celle d'Auth.js par défaut, écrite pour la limite d'envoi). */
export const validiteLienSecondes = 24 * 60 * 60;

export const googleConfigure = Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);

const fournisseurs: Provider[] = [
  Resend({
    maxAge: validiteLienSecondes,
    // L'envoi passe par envoyerEmail : sans clé Resend, le lien est écrit dans .emails/.
    sendVerificationRequest: ({ identifier, url }) =>
      envoyerEmail({
        a: identifier,
        sujet: "Votre lien de connexion",
        contenu: EmailLienConnexion({ url }),
      }),
  }),
];

if (googleConfigure) {
  fournisseurs.push(
    // Google vérifie l'adresse : un client qui a déjà laissé un avis ou commandé avec la même
    // adresse retrouve son compte au lieu d'être refusé.
    Google({ allowDangerousEmailAccountLinking: true }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: fournisseurs,
  pages: { signIn: "/connexion", verifyRequest: "/connexion/verification", error: "/connexion" },
  callbacks: {
    // Par défaut, Auth.js n'expose que le nom, l'e-mail et la photo : l'identifiant sert à
    // relier commandes, adresses et favoris.
    session: ({ session, user }) => ({ ...session, user: { ...session.user, id: user.id } }),
  },
  events: {
    // Les commandes passées en invité avec cette adresse rejoignent le compte : l'adresse
    // vient d'être prouvée par le lien magique ou par Google.
    async signIn({ user }) {
      if (!user.id || !user.email) return;
      await db.order.updateMany({
        where: { userId: null, email: { equals: user.email, mode: "insensitive" } },
        data: { userId: user.id },
      });
    },
  },
});
