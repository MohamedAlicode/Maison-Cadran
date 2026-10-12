import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { boutique } from "@/config/boutique";
import "./globals.css";

// Polices auto-hébergées par next/font : aucun appel à Google côté visiteur (RGPD) et pas de saut de mise en page.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
