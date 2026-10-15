// Client Stripe côté serveur. Le site fonctionne sans clé (catalogue, panier) :
// seul le bouton de paiement indique alors que le paiement n'est pas configuré.
import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";

export const paiementConfigure = Boolean(env.STRIPE_SECRET_KEY);

let client: Stripe | undefined;

export function stripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY manquante : le paiement n'est pas configuré.");
  }
  client ??= new Stripe(env.STRIPE_SECRET_KEY, { appInfo: { name: "Maison Cadran" } });
  return client;
}
