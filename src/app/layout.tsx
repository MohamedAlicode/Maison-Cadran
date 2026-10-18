import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { boutique } from "@/config/boutique";
import "./globals.css";

// Polices auto-hébergées par next/font : aucun appel à Google côté visiteur (RGPD) et pas de saut de mise en page.
// Instrument Serif n'existe qu'en graisse 400 : les titres restent en font-normal pour éviter un faux gras.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${boutique.nom} | Montres de caractère, authenticité garantie`,
    template: `%s | ${boutique.nom}`,
  },
  description:
    "Montres automatiques, quartz et solaires de Tissot, Hamilton, Seiko, Citizen et d'autres maisons, sélectionnées avec soin. Livraison assurée et retours gratuits sous 14 jours.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: boutique.nom,
  },
};

// Next exige une couleur littérale ici : c'est la valeur du token --color-acier.
export const viewport: Viewport = {
  themeColor: "#f1f1ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} ${hankenGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
