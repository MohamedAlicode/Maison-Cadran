// Premier filtre de /compte et /admin : sans cookie de session, on part droit vers la connexion.
// Ce n'est qu'un raccourci : la vraie vérification (session valide, rôle admin) est refaite
// dans chaque page et chaque action, car un cookie peut être expiré ou forgé.
import { NextResponse, type NextRequest } from "next/server";

const COOKIES_SESSION = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(requete: NextRequest) {
  if (COOKIES_SESSION.some((nom) => requete.cookies.has(nom))) return NextResponse.next();
  const { pathname, search } = requete.nextUrl;
  const connexion = new URL("/connexion", requete.url);
  connexion.searchParams.set("retour", pathname + search);
  return NextResponse.redirect(connexion);
}

export const config = {
  matcher: ["/compte/:path*", "/admin/:path*"],
};
