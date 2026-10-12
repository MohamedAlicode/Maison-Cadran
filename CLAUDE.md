@AGENTS.md

# Maison Cadran

Boutique en ligne de montres neuves (100 à 2 000 €), en français. Contexte produit : `PRODUCT.md`. Système visuel : `DESIGN.md`.

## Workflow design

Ce workflow s'applique à toute session jusqu'à la fin du projet, sans qu'on ait à le redemander.

### Où sont les choses

- **Design system ui-ux-pro-max :** `design-system/maison-cadran/MASTER.md`.
- **Overrides par page (prioritaires sur le MASTER) :** `design-system/maison-cadran/pages/accueil.md`, `catalogue.md`, `fiche-produit.md`, `panier-checkout.md`.
- **Tokens, seule source de vérité :** `src/app/globals.css` (bloc `@theme` pour les utilitaires Tailwind, bloc `:root` pour les durées et les marges de photo). Aucune autre valeur de couleur, taille, ombre ou durée n'est écrite ailleurs. Seule exception : `themeColor` dans `src/app/layout.tsx`, que Next exige en littéral.
- **Système visuel décrit :** `DESIGN.md` et son complément `.impeccable/design.json`. À régénérer avec `/impeccable document` quand les tokens changent.
- **Skills :** `.claude/skills/ui-ux-pro-max/` (recherche : `python3 .claude/skills/ui-ux-pro-max/scripts/search.py`) et `.claude/skills/impeccable/` (CLI : `.claude/skills/impeccable/scripts/impeccable`).

### Ordre des pages

Layout global (header et footer), puis accueil, catalogue, fiche produit, panier et checkout. Attendre l'OK de Boss avant de passer à la page suivante.

### Cycle pour chaque page

1. Lire `design-system/maison-cadran/MASTER.md`, puis l'override de la page s'il existe (l'override est prioritaire).
2. Si la page est nouvelle : `/impeccable shape` avant de coder.
3. Implémenter.
4. Lancer `/impeccable critique` puis `/impeccable audit` sur la page, et `npx impeccable detect` sur les fichiers modifiés. Corriger ce qui ressort.
5. Vérifier à 375, 768, 1024 et 1440 px : contraste de 4,5:1 minimum, focus clavier visible, `prefers-reduced-motion` respecté.
6. Donner à Boss un résumé court (ce qui a changé et pourquoi), puis faire un commit séparé.

### Règles anti « vibe-codé » : design

- Interdits : dégradés violet ou bleu, emojis comme icônes (utiliser des SVG Lucide ou Heroicons), cartes dans des cartes, noir ou gris purs (toujours teintés), Inter ou Arial par défaut, easing bounce ou elastic, effets gratuits (glow, glassmorphism décoratif).
- Les photos de montres sont la vedette : fonds sobres, espace généreux, hiérarchie claire marque, puis modèle, puis prix.
- Fiche produit : caractéristiques lisibles (mouvement, diamètre, matériaux, étanchéité), éléments de confiance (garantie, authenticité, retours) visibles sans être criards.
- Cohérence plutôt qu'originalité : chaque nouvel élément réutilise les tokens et les composants existants.

### Règles anti « vibe-codé » : code

- Changements petits et ciblés. Ne jamais réécrire un fichier entier sans que Boss le demande.
- Aucune nouvelle dépendance sans la validation de Boss.
- Respecter les conventions de nommage (en français) et la structure de dossiers.
- Ne pas casser la logique existante (panier, données, routes).
- Pour chaque décision non évidente, expliquer le « pourquoi » en 1 ou 2 phrases, pour que Boss puisse la justifier lui-même.
- Pas de code mort, pas de commentaires qui paraphrasent le code, pas de fonctionnalité non demandée.

### Décisions en attente

- **Verre liquide :** limité pour l'instant à l'en-tête collant et aux barres posées sur une photo (voir la règle du verre utile dans `DESIGN.md`). À élargir seulement si Boss le demande.
- **Club de membres :** demandé, mais ses avantages et ses conditions ne sont pas définis. Ne rien construire ni inventer avant sa décision.
