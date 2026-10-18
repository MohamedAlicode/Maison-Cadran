# Back-office : `/admin`

> Override du MASTER pour `/admin/*`. Brief issu de `/impeccable shape` (phase 5), dans le monde visuel existant : aucune nouvelle direction.

- **Qui arrive :** la personne qui tient la boutique, seule, souvent entre deux expéditions. Elle veut savoir ce qui attend une action (commandes à préparer, stocks bas, avis à relire), puis le faire en peu de clics.
- **Tâche principale :** traiter les commandes (préparer, expédier avec numéro de suivi, rembourser). Le catalogue, les codes promo, les avis et le guide viennent ensuite.
- **Structure :** même cadre que l'espace client : navigation en colonne fixe dès `lg`, rangée défilante en dessous ; contenu sur fond acier, sections en `bg-blanc rounded-cadre`. Pas d'en-tête de boutique ni de banderole : un lien « Voir la boutique » suffit. Pas de verre : ce sont des pages de travail.
- **Tableaux :** listes en lignes séparées par des filets dans une section blanche, colonnes alignées sur `lg`, empilées sur mobile. Chiffres en `chiffres`, statuts en `Badge` (mêmes couleurs que l'espace client).
- **Formulaires :** `Field` et `classeSaisie` partout, un bouton principal par formulaire, erreurs sous le champ. Une action qui ne se défait pas (remboursement, suppression) demande une confirmation explicite.
- **États à couvrir :** non connecté (redirection vers `/connexion?retour=`), connecté sans rôle admin (404, pour ne pas révéler la page), listes vides, Stripe non configuré (remboursement indisponible, dit clairement).
- **Interdits ici :** graphiques décoratifs, couleurs nouvelles, chiffres inventés ou estimés, avantages du club de membres.
