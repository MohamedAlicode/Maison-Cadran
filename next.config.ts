import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Photos ajoutées depuis le back-office : fichiers du site ou Cloudinary, rien d'autre.
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  partialPrefetching: true,
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
