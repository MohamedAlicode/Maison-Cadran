# Skills de projet

Copiés tels quels depuis leurs dépôts d'origine le 2026-10-12.

| Skills | Source | Version |
| --- | --- | --- |
| ui-ux-pro-max, banner-design, brand, design, design-system, slides, ui-styling | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/`, MIT) | v2.15.0, commit 7246805 |
| impeccable | https://github.com/pbakaus/impeccable (`.claude/skills/impeccable`, Apache-2.0) | 0.1.14, commit 245ad82 |

Notes :
- Les hooks automatiques d'Impeccable (SessionStart, PostToolUse, Stop) ne sont pas installés.
- Le lanceur `impeccable/scripts/impeccable` télécharge au premier lancement un binaire depuis les releases GitHub de pbakaus/impeccable (vérifié par SHA-256) dans `~/.impeccable/bin/`.
- La télémétrie d'Impeccable est coupée pour tout le projet par la variable `IMPECCABLE_NO_TELEMETRY=1`, définie dans `.claude/settings.json`. Le moteur 0.1.14 ne lit que cette variable (ou `DO_NOT_TRACK`) ; la clé `"telemetry": false` de `.impeccable/config.json` n'est lue qu'à partir des versions suivantes et reste en place pour elles.
- Pour mettre à jour : recopier les dossiers depuis les dépôts sources.
