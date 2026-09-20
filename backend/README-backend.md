# Backend — Système de sécurité IoT

API REST du projet intégrateur (420-321-AH, AEC Internet des objets et intelligence artificielle, Collège Ahuntsic). Gère l'authentification, les capteurs, les lectures, la journalisation et les notifications d'un système de détection d'intrusion.

## Stack technique

Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt

## Démarrage rapide

```bash
cd backend
npm install
cp .env.example .env   # puis remplir les valeurs, voir ci-dessous
npm run dev             # démarre avec redémarrage automatique (nodemon)
```

Le serveur démarre sur `http://localhost:3000` par défaut.

**Prérequis** : MongoDB doit tourner localement (`mongodb://localhost:27017`), par exemple via MongoDB Compass ou `mongod` en ligne de commande.

## Variables d'environnement (`.env`)

| Variable | Description | Exemple |
|---|---|---|
| `MONGO_URI` | URI de connexion à MongoDB | `mongodb://localhost:27017/securite-iot` |
| `PORT` | Port d'écoute du serveur | `3000` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | une chaîne longue et aléatoire |
| `JWT_EXPIRE` | Durée de validité d'un token | `24h` |
| `ARM_CODE` | Code requis pour armer/désarmer un capteur | `1234` (à améliorer : un code par utilisateur) |

⚠️ Ne jamais commiter le fichier `.env` (déjà exclu par `.gitignore`). Utiliser `.env.example` comme modèle.

## Structure du projet

```
backend/
├── server.js                  # Point d'entrée : connexion DB + démarrage du serveur
├── src/
│   ├── app.js                  # Définition de l'application Express (routes, middlewares)
│   ├── config/
│   │   └── db.js                # Connexion à MongoDB (Mongoose)
│   ├── models/                  # Schémas Mongoose
│   │   ├── User.js                # Comptes (avec loginAttempts, lockedUntil, pushToken)
│   │   ├── Session.js
│   │   ├── Sensor.js
│   │   ├── SensorReading.js
│   │   ├── Classification.js
│   │   ├── Alert.js
│   │   └── Log.js                 # Journalisation centralisée
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── sensor.controller.js
│   │   ├── log.controller.js
│   │   └── errors.js              # Gestion d'erreurs centralisée
│   ├── services/
│   │   ├── auth.service.js         # Inscription, connexion, verrouillage de compte
│   │   ├── log.service.js           # logAction() — fonction de journalisation réutilisable
│   │   └── python.service.js         # Appel du script Python (classification), en processus enfant
│   ├── middlewares/
│   │   └── auth.middleware.js         # verifyToken + authorizeRoles
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── sensor.routes.js
│   │   ├── log.routes.js
│   │   └── permissions.routes.js
│   ├── scripts/                        # Module de classification (Python)
│   │   ├── classifier.py
│   │   └── modules/
│   │       ├── ai_logic.py
│   │       └── gpio.py
│   └── data/
│       └── seed.js                     # Données de démonstration
└── tests-insomnia/
    ├── Collection_Tests_Backend.json     # À importer dans Insomnia
    └── PLAN_DE_TEST.md                    # Plan de test détaillé
```

## Routes disponibles

### Authentification (`/api/auth`)

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Non | Créer un compte (mot de passe ≥ 8 caractères) |
| POST | `/api/auth/login` | Non | Se connecter, retourne un token JWT (24h) |
| GET | `/api/auth/me` | Oui (JWT) | Retourne les infos de l'utilisateur connecté |

**Sécurité** : après 3 tentatives de connexion échouées sur un même compte, celui-ci est verrouillé automatiquement pendant 5 minutes.

### Capteurs (`/api/sensors`)

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| POST | `/api/sensors/:id/arm` | Code (`ARM_CODE`) | Arme le capteur ; refuse si déjà armé (409) |
| POST | `/api/sensors/:id/disarm` | Code (`ARM_CODE`) | Désarme le capteur ; refuse si déjà désarmé (409) |
| GET | `/api/sensors/:id/status` | Non | Retourne l'état actuel (`armed: true/false`) |
| POST | `/api/sensors/:id/readings` | Non | Enregistre une nouvelle lecture du capteur |
| GET | `/api/sensors/:id/history` | Non | Historique paginé, filtrable par date (`?page=&limit=&from=&to=`) |

### Journalisation (`/api/logs`)

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| GET | `/api/logs` | JWT + rôle `admin` | Retourne les 100 derniers logs (connexions, capteurs, erreurs) |

### Notifications (`/api/permissions`)

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| POST | `/api/permissions` | JWT | Enregistre le token de notification push (Expo) de l'utilisateur |

**Authentification JWT** : pour les routes protégées par token, envoyer l'en-tête `Authorization: Bearer <token>`.

### À venir / hors périmètre actuel
- Intégration complète du module de classification Python et création automatique d'alertes
- Filtre par type d'événement sur l'historique (nécessiterait un champ `type` sur `SensorReading`)
- Permissions par capteur (accès restreint selon l'utilisateur) — hors périmètre du MVP, décision d'équipe

## Modèle de données

Voir le diagramme de classes du projet pour le détail complet des attributs et relations. Résumé rapide :

- **User** — comptes (rôles `user` / `admin`), avec verrouillage de compte et token de notification push
- **Session** — sessions actives d'un utilisateur
- **Sensor** — un capteur physique (ultrason), avec son état `armed`
- **SensorReading** — une lecture individuelle d'un capteur
- **Classification** — résultat de l'analyse IA sur une série de lectures (`isIntrusion`, `confidence`)
- **Alert** — une alerte déclenchée par une classification positive, résolue par un utilisateur
- **Log** — journalisation centralisée (niveau, message, utilisateur concerné, horodatage)

## Conventions du projet

- Structure en couches : `routes → controllers → services → models`
- Noms de fichiers, variables et champs en anglais
- Mots de passe toujours hachés avec `bcrypt` avant stockage — jamais en clair
- Gestion d'erreurs centralisée via un middleware global dans `app.js`, qui journalise aussi les erreurs
- Toute modification passe par une Pull Request vers `main` (règle de protection activée sur le dépôt)

## Tests

Les tests ont été réalisés **manuellement** avec Insomnia, au fur et à mesure du développement (voir `tests-insomnia/PLAN_DE_TEST.md` pour le détail complet). Aucune suite de tests automatisés (Jest) n'a été mise en place, faute de temps sur les trois sprints — identifié comme amélioration future.

Pour reproduire les tests : importer `tests-insomnia/Collection_Tests_Backend.json` dans Insomnia et suivre le plan de test.

## Avancement par sprint

| Sprint | Statut | Contenu |
|---|---|---|
| Sprint 1 | ✅ Complété | Setup Express, MongoDB, modèles, authentification JWT |
| Sprint 2 | ✅ Complété | Armer/désarmer, lectures, historique paginé/filtrable, verrouillage de compte, journalisation, route admin des logs, notifications push |
| Sprint 3 | ⏳ Partiel | Script de classification simplifié préparé ; intégration complète et création automatique d'alertes à finaliser |

## Équipe

Ce backend est développé et maintenu par Blondel-Junior Duperval dans le cadre du projet intégrateur.
