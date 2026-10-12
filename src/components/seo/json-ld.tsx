/** Données structurées schema.org, injectées en JSON-LD (lu par Google pour les résultats enrichis). */
export function JsonLd({ donnees }: { donnees: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Échappement de « < » pour empêcher toute fermeture prématurée de la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }}
    />
  );
}
