# Espace client : connexion, compte, commandes, adresses, favoris

> Override du MASTER pour `/connexion` et `/compte/*`. Brief issu de `/impeccable shape` (phase 4), dans le monde visuel existant : aucune nouvelle direction.

- **Qui arrive :** un client qui vient d'acheter sa première montre sérieuse, ou qui hésite et garde des modèles de côté. Il veut retrouver une commande, une facture ou un favori, vite, sans mot de passe.
- **Tâche principale :** se connecter par lien magique (Google en second, seulement si ses clés existent), puis lire l'état de ses commandes. Le reste (adresses, favoris) est secondaire et se trouve en un clic.
- **Structure :** une colonne de navigation fixe (Tableau de bord, Commandes, Adresses, Favoris, Se déconnecter) à gauche dès `lg`, en rangée défilante au-dessus du contenu en dessous. Contenu sur fond acier, sections en `bg-blanc rounded-cadre` comme le récapitulatif de commande, jamais de carte dans une carte. Pas de verre : ces pages sont des pages de travail, comme le panier.
- **États à couvrir :** non connecté (redirection vers `/connexion?retour=`), lien envoyé, lien expiré ou refusé, aucune commande, aucune adresse, aucun favori (chacun avec un lien vers les montres), commande d'un autre client (404).
- **Réutiliser :** `Container`, `Button`, `Field`, `Badge` pour le statut de commande, le récapitulatif et les adresses de la page de confirmation, `GrilleProduits` pour les favoris. Le cœur favori des cartes est un bouton rond posé sur la photo : c'est l'un des cas où le verre est utile.
- **Interdits ici :** inventer des avantages de compte ou du club de membres, des points de fidélité, des recommandations ; demander un mot de passe.
