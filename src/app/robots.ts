import type { MetadataRoute } from "next";

// Seuls le back-office et l'API sont fermés aux robots. Les pages privées (compte, panier…)
// portent déjà un « noindex », que les moteurs ne liraient pas si elles étaient bloquées ici.
export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: new URL("/sitemap.xml", site).toString(),
  };
}
