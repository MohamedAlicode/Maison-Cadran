# Maison Cadran : fichier maître du design system

> **Logique :** avant de travailler une page, lire `design-system/maison-cadran/pages/<page>.md`.
> S'il existe, ses règles **priment** sur ce fichier. Sinon, suivre ce fichier.

Direction retenue par Boss le 2026-10-12 : **B, « Acier et cadran bleu »**.
Généré au départ par `ui-ux-pro-max/scripts/search.py`, puis réécrit pour la direction B.

**Source de vérité des valeurs :** `src/app/globals.css` (bloc `@theme` et `:root`). Ce fichier décrit les rôles et les règles, il ne recopie pas les hex. Le détail visuel complet est dans `DESIGN.md` à la racine.

---

## Couleurs (tokens)

| Rôle                                  | Token Tailwind                 | Contraste         |
| ------------------------------------- | ------------------------------ | ----------------- |
| Fond de page                          | `acier`                        |                   |
| Photos, surfaces, champs              | `blanc`                        |                   |
| Sections sombres (hero, pied de page) | `nuit`                         |                   |
| Texte                                 | `encre`                        | 15,6:1 sur acier  |
| Texte secondaire, sur-titres          | `graphite`                     | 6,0:1 sur acier   |
| Bordures décoratives                  | `filet`                        |                   |
| Contour des contrôles                 | `filet-fort`                   | 3,4:1 sur acier   |
| CTA, liens, focus                     | `cadran`                       | 10,1:1 sur acier  |
| Survol du CTA                         | `cadran-fonce`                 |                   |
| Accent sur fond nuit                  | `cadran-clair`                 | 9,1:1 sur nuit    |
| Succès / alerte / erreur              | `sauge` / `ambre` / `bordeaux` | 5,6 / 5,1 / 6,2:1 |

## Typographie

- **Titres :** Instrument Serif, graisse 400 uniquement (`font-normal`).
- **Texte, prix, boutons :** Hanken Grotesk.
- **Échelle :** `text-xs` (12) · `text-libelle` (13) · `text-sm` (14) · `text-base` (16) · `text-lg` … `text-8xl` (96, hero de l'accueil).
- **Interlignes de titres :** `leading-affiche` (1,05) et `leading-titre` (1,1).
- **Approches :** `tracking-surtitre` (capitales), `tracking-titre`, `tracking-logo`.
- Prix et caractéristiques en chiffres tabulaires (classe `chiffres`).

## Espacements, formes, profondeur, mouvement

- Pas de 4 px (`--spacing`). Aucune marge arbitraire en px.
- Marge des photos : `p-(--marge-photo)` (10 %), `-serree` (4 %), `-large` (12 %).
- Coins : `rounded-xs` (2 px) pour cases et surlignages, `rounded-controle` (10 px) pour les champs, `rounded-cadre` (16 px) pour les cadres photo, `rounded-full` pour boutons, badges et pastilles.
- Une seule ombre : `shadow-tiroir`, pour les panneaux au-dessus de la page.
- Verre : `backdrop-blur-verre` sur fond acier à 85 % au moins, en-tête collant et barres posées sur une photo seulement.
- Durées : `duration-(--duree-courte)` 180 ms, `-moyenne` 300 ms, `-longue` 500 ms. Courbe unique `ease-maison`.

## Composants existants (à réutiliser avant d'en créer)

`src/components/ui/` : Button (principal, secondaire, clair, fantôme), Badge, Price, Eyebrow, SectionHeading, Input, Field, Checkbox, Drawer, Accordion, Breadcrumb, TextLink, Stars, Progress, Container.

## Interdits

- Dégradés violet/bleu, lueurs, glassmorphism décoratif, easing bounce ou elastic.
- Emojis comme icônes : Lucide uniquement, trait 1,5.
- Cartes dans des cartes. Noir ou gris purs. Inter, Arial ou police système comme police de marque.
- Logos officiels de marque, « garantie constructeur ».

## Checklist avant livraison

- [ ] 375 / 768 / 1024 / 1440 px sans défilement horizontal
- [ ] Texte à 4,5:1 minimum, contrôles à 3:1
- [ ] Focus clavier visible partout
- [ ] `prefers-reduced-motion` respecté
- [ ] Aucune valeur en dur (couleur, taille, durée)
- [ ] `impeccable detect` propre sur les fichiers modifiés
