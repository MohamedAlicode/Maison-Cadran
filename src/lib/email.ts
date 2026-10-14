// Envoi des e-mails transactionnels avec Resend.
// Sans clé (développement, démo), l'e-mail est écrit dans .emails/ pour pouvoir l'ouvrir.
import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { boutique } from "@/config/boutique";
import { env } from "@/lib/env";

type PieceJointe = { nom: string; contenu: Buffer };

export async function envoyerEmail({
  a,
  sujet,
  contenu,
  piecesJointes = [],
}: {
  a: string;
  sujet: string;
  contenu: ReactElement;
  piecesJointes?: PieceJointe[];
}) {
  const [html, texte] = await Promise.all([render(contenu), render(contenu, { plainText: true })]);

  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`E-mail non envoyé (RESEND_API_KEY absente) : « ${sujet} » à ${a}`);
      return;
    }
    const dossier = path.join(process.cwd(), ".emails");
    const base = `${new Date().toISOString().replaceAll(":", "-")}-${sujet.replace(/[^\p{L}\d]+/gu, "-")}`;
    await mkdir(dossier, { recursive: true });
    await writeFile(path.join(dossier, `${base}.html`), html);
    for (const piece of piecesJointes) {
      await writeFile(path.join(dossier, `${base}-${piece.nom}`), piece.contenu);
    }
    console.info(`E-mail « ${sujet} » pour ${a} écrit dans .emails/${base}.html`);
    return;
  }

  const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
    from: env.EMAIL_EXPEDITEUR ?? `${boutique.nom} <onboarding@resend.dev>`,
    to: a,
    subject: sujet,
    html,
    text: texte,
    attachments: piecesJointes.map((p) => ({ filename: p.nom, content: p.contenu })),
  });
  if (error) throw new Error(`Envoi de l'e-mail « ${sujet} » impossible : ${error.message}`);
}
