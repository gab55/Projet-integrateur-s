# Plan de test — Backend (Sprints 1 et 2)

À importer dans Insomnia : `Collection_Tests_Backend.json` (Application → Import → From File).

Après import, ouvrir l'environnement « Base Environment » et vérifier `base_url` (par défaut `http://localhost:3000`). Après une connexion réussie, copier le token reçu dans la variable `token`. Pour tester la section Journalisation, un second compte avec `role: "admin"` est requis (voir Préalables) — copier son token dans `admin_token`.

## Préalables

- Le serveur backend doit tourner (`npm run dev` dans `backend/`)
- MongoDB doit tourner localement
- Créer au moins un capteur dans MongoDB Compass (collection `sensors`) et copier son `_id` dans la variable `sensor_id` :
```json
{
  "type": "ultrasonic",
  "model": "HC-SR04",
  "location": "Entrée principale",
  "armed": false
}
```
- Pour tester les routes admin : créer un compte via `/api/auth/register`, puis dans MongoDB Compass, ouvrir ce document dans `users` et changer `role: "user"` en `role: "admin"`. Se reconnecter pour obtenir un token à jour.

## 1. Authentification

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | Inscription | 201, utilisateur retourné sans `passwordHash` |
| 2 | Inscription — mot de passe trop court | 400, message sur la longueur minimale |
| 3 | Connexion | 200, `{ token, user }` reçu |
| 4 | Connexion — mauvais mot de passe (x3) | 401 `Invalid identifiers`, les 2 premières fois |
| 5 | Connexion sur compte verrouillé | 401 `Account locked...`, après la 3e tentative échouée |
| 6 | Profil connecté (`/me`) avec token | 200, profil retourné |
| 7 | Profil sans token | 401 `Missing token` |

## 2. Capteurs

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | Armer le capteur | 200, `armed: true` |
| 2 | Armer deux fois de suite | 409 `Sensor is already armed` |
| 3 | Désarmer le capteur | 200, `armed: false` |
| 4 | Désarmer deux fois de suite | 409 `Sensor is already disarmed` |
| 5 | Armer avec mauvais code | 401 `Invalid code` |
| 6 | Statut du capteur | 200, `{ armed: true/false }` |
| 7 | Ajouter une lecture | 201, lecture retournée |
| 8 | Consulter l'historique | 200, tableau trié + objet `pagination` |
| 9 | Historique — pagination et filtre par date | 200, résultats filtrés selon `from`/`to`, respecte `limit` |

## 3. Journalisation (admin seulement)

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | Consulter les logs — rôle `user` | 403 `Access denied` |
| 2 | Consulter les logs — rôle `admin` | 200, jusqu'à 100 logs, triés du plus récent au plus ancien |
| 3 | Consulter les logs — sans token | 401 `Missing token` |

Vérifier dans MongoDB Compass (collection `logs`) que les actions suivantes créent bien une entrée : connexion réussie, tentative échouée, verrouillage de compte, armement, désarmement, code invalide, erreur serveur.

## 4. Notifications (permissions)

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | Enregistrer le token de notification push | 200, `{ success: true }` ; vérifier le champ `pushToken` sur l'utilisateur dans Compass |

## En cas d'échec

- Vérifier que le serveur tourne et affiche `MongoDB : connecté`
- Vérifier que `sensor_id` correspond à un vrai document dans MongoDB
- Vérifier que le corps de la requête est bien en **JSON** (pas XML/texte) dans Insomnia
- Vérifier que `ARM_CODE` et `JWT_SECRET` dans le `.env` du serveur sont bien définis

## Non couvert par cette collection

- Intégration du module de classification Python et création automatique d'alertes (Sprint 3)
- Filtre par type d'événement sur l'historique (non implémenté — le modèle `SensorReading` n'a pas de champ `type`)
- Permissions par capteur (accès restreint selon l'utilisateur) — hors périmètre, décision d'équipe
- Tests automatisés (Jest) — les tests ci-dessus sont réalisés manuellement, voir la section « Tests — Backend » du rapport final
