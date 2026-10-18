"use server";

// Server Actions de l'espace client. Chacune relit la session : un identifiant de client
// envoyé par le navigateur ne compte jamais.
import { AuthError } from "next-auth";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut, validiteLienSecondes } from "@/lib/auth";
import { cheminRetour, schemaAdresseCompte } from "@/lib/compte/regles";
import { clientConnecte } from "@/lib/compte/serveur";
import { db } from "@/lib/db";

export type EtatConnexion = { message: string; email: string } | null;

// Au plus 3 liens par adresse en 10 minutes, pour qu'on ne puisse pas inonder une boîte mail
// depuis notre formulaire. Les jetons encore en base font le compte : un lien utilisé en sort.
const LIENS_MAX = 3;
const FENETRE_LIENS_MS = 10 * 60 * 1000;

async function tropDeLiens(email: string) {
  const emisApres = Date.now() + validiteLienSecondes * 1000 - FENETRE_LIENS_MS;
  const recents = await db.verificationToken.count({
    // Auth.js range l'adresse en minuscules, sans espaces.
    where: { identifier: email.toLowerCase(), expires: { gt: new Date(emisApres) } },
  });
  return recents >= LIENS_MAX;
}

export async function demanderLien(
  _etat: EtatConnexion,
  formulaire: FormData,
): Promise<EtatConnexion> {
  const saisie = String(formulaire.get("email") ?? "");
  const email = z.email().safeParse(saisie.trim());
  if (!email.success) return { message: "Indiquez une adresse e-mail valide.", email: saisie };
  if (await tropDeLiens(email.data)) {
    return {
      message:
        "Plusieurs liens ont déjà été envoyés à cette adresse. Utilisez le plus récent, ou réessayez dans 10 minutes.",
      email: saisie,
    };
  }
  try {
    // Sans redirection automatique : Auth.js passerait par sa propre route avant notre page.
    await signIn("resend", {
      email: email.data,
      redirect: false,
      redirectTo: cheminRetour(formulaire.get("retour")),
    });
  } catch (erreur) {
    if (erreur instanceof AuthError) {
      console.error("Envoi du lien de connexion impossible", erreur);
      return {
        message: "Le lien n'a pas pu être envoyé. Réessayez dans un instant.",
        email: saisie,
      };
    }
    throw erreur;
  }
  redirect("/connexion/verification");
}

export async function connexionGoogle(formulaire: FormData) {
  await signIn("google", { redirectTo: cheminRetour(formulaire.get("retour")) });
}

export async function seDeconnecter() {
  await signOut({ redirectTo: "/" });
}

type Champ = keyof z.input<typeof schemaAdresseCompte>;

export type EtatAdresse =
  | { ok: true }
  | {
      ok: false;
      message: string;
      erreurs?: Partial<Record<Champ, string>>;
      // Renvoyées pour réafficher la saisie : React vide le formulaire après chaque envoi.
      valeurs: Record<string, string>;
    }
  | null;

export async function enregistrerAdresse(
  _etat: EtatAdresse,
  formulaire: FormData,
): Promise<EtatAdresse> {
  const valeurs = Object.fromEntries([...formulaire].map(([cle, valeur]) => [cle, String(valeur)]));
  const client = await clientConnecte();
  if (!client) return { ok: false, message: "Votre session a expiré : reconnectez-vous.", valeurs };

  const saisie = schemaAdresseCompte.safeParse(valeurs);
  if (!saisie.success) {
    const { fieldErrors } = z.flattenError(saisie.error);
    return {
      ok: false,
      message: "Certains champs sont à corriger.",
      erreurs: Object.fromEntries(
        Object.entries(fieldErrors).map(([champ, messages]) => [champ, messages?.[0]]),
      ),
      valeurs,
    };
  }
  const a = saisie.data;
  const donnees = {
    label: a.libelle,
    firstName: a.prenom,
    lastName: a.nom,
    company: a.societe,
    line1: a.ligne1,
    line2: a.ligne2,
    postalCode: a.codePostal,
    city: a.ville,
    phone: a.telephone,
  };

  const id = valeurs.id;
  if (id) {
    const modifiee = await db.address.updateMany({
      where: { id, userId: client.id },
      data: donnees,
    });
    if (modifiee.count === 0) return { ok: false, message: "Adresse introuvable.", valeurs };
    if (a.parDefaut) await rendreParDefaut(client.id, id);
  } else {
    const existantes = await db.address.count({ where: { userId: client.id } });
    if (existantes >= 10) {
      return { ok: false, message: "Vous pouvez enregistrer jusqu'à 10 adresses.", valeurs };
    }
    const creee = await db.address.create({ data: { ...donnees, userId: client.id } });
    // La première adresse devient l'adresse par défaut sans qu'on ait à la cocher.
    if (a.parDefaut || existantes === 0) await rendreParDefaut(client.id, creee.id);
  }
  refresh();
  return { ok: true };
}

async function rendreParDefaut(clientId: string, id: string) {
  await db.$transaction([
    db.address.updateMany({ where: { userId: clientId }, data: { isDefault: false } }),
    db.address.updateMany({ where: { id, userId: clientId }, data: { isDefault: true } }),
  ]);
}

export async function definirAdresseParDefaut(id: string) {
  const client = await clientConnecte();
  if (!client) return;
  await rendreParDefaut(client.id, id);
  refresh();
}

export async function supprimerAdresse(id: string) {
  const client = await clientConnecte();
  if (!client) return;
  const adresse = await db.address.findFirst({
    where: { id, userId: client.id },
    select: { isDefault: true },
  });
  if (!adresse) return;
  await db.address.delete({ where: { id } });
  if (adresse.isDefault) {
    const suivante = await db.address.findFirst({
      where: { userId: client.id },
      select: { id: true },
    });
    if (suivante) await rendreParDefaut(client.id, suivante.id);
  }
  refresh();
}

export type ResultatFavori = { ok: true; favori: boolean } | { ok: false; connecte: false };

export async function basculerFavori(produitId: string): Promise<ResultatFavori> {
  const client = await clientConnecte();
  if (!client) return { ok: false, connecte: false };
  const id = z.cuid().parse(produitId);
  const cle = { userId_productId: { userId: client.id, productId: id } };
  const existant = await db.wishlistItem.findUnique({ where: cle, select: { userId: true } });
  if (existant) {
    await db.wishlistItem.delete({ where: cle });
    return { ok: true, favori: false };
  }
  const produit = await db.product.findFirst({
    where: { id, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!produit) return { ok: true, favori: false };
  await db.wishlistItem.create({ data: { userId: client.id, productId: id } });
  return { ok: true, favori: true };
}
