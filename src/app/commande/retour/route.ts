// Retour de Stripe Checkout après un paiement : on vide le panier et son code promo (un cookie
// ne peut être modifié que dans un Route Handler ou une Server Action), puis on affiche la
// confirmation.
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_CODE_PROMO } from "@/lib/panier/codes-promo";
import { COOKIE_PANIER } from "@/lib/panier/regles";

export function GET(requete: NextRequest) {
  const sessionId = requete.nextUrl.searchParams.get("session_id");
  const destination = new URL("/commande/confirmation", requete.nextUrl);
  if (sessionId) destination.searchParams.set("session_id", sessionId);

  const reponse = NextResponse.redirect(destination, 303);
  reponse.cookies.delete(COOKIE_PANIER);
  reponse.cookies.delete(COOKIE_CODE_PROMO);
  return reponse;
}
