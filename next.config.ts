import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Photos ajoutées depuis le back-office : fichiers du site ou Cloudinary, rien d'autre.
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  partialPrefetching: true,
  // En-têtes de sécurité de base : pas d'affichage du site dans un cadre d'un autre site
  // (clickjacking), pas de type de fichier deviné, et aucun accès caméra, micro ou position.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // Les polices de la facture PDF sont lues sur le disque : on les embarque avec les routes qui la génèrent.
  outputFileTracingIncludes: {
    "/api/factures/*": ["src/lib/facture/polices/*"],
    "/api/webhooks/stripe": ["src/lib/facture/polices/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
