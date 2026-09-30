# AdonisJS 7 + Inertia + React

Base issue du [starter officiel React](https://github.com/adonisjs/starter-kits/tree/inertia-react), avec TypeScript, Vite, Lucid/PostgreSQL et authentification par session.

## Prérequis

- Docker avec le plugin Compose

## Développement

Le projet est entièrement conteneurisé. Le service `app` construit l'application AdonisJS et le service `postgres` fournit PostgreSQL 17 avec un volume persistant.

```sh
docker compose up --build -d
```

Ouvrir <http://localhost:3333>.

Pour installer le projet depuis un nouveau clone :

```sh
cp .env.example .env
docker compose build app
```

Si `APP_KEY` est vide, générer une clé depuis l'image puis la reporter dans `.env` :

```sh
docker compose run --rm --no-deps -e APP_KEY=temporary app node ace generate:key --show
```

Lancer ensuite l'environnement :

```sh
docker compose up -d
docker compose ps
```

Les migrations Lucid sont appliquées automatiquement avant chaque démarrage de l'application. Le volume Docker `postgres_data` conserve les données PostgreSQL entre les redémarrages. Le fichier `.env` est exclu de Git.

Pour consulter les journaux ou arrêter l'environnement :

```sh
docker compose logs -f app
docker compose down
```

`docker compose down -v` supprime également les données PostgreSQL et ne doit être utilisé que pour réinitialiser volontairement la base.

### Développement sans Docker

Node.js 24, npm 11 et PostgreSQL sont nécessaires :

```sh
npm ci
node ace migration:run
npm run dev
```

## Pages et organisation

- `/` : accueil Inertia
- `/signup` et `/login` : inscription et connexion
- `/dashboard` : page réservée aux utilisateurs connectés
- `start/routes.ts` : routes du backend
- `app/controllers/` : contrôleurs AdonisJS
- `inertia/pages/` : pages React
- `inertia/layouts/` : layouts React
- `inertia/css/app.css` : styles
- `database/migrations/` : migrations Lucid
- `.adonisjs/` : types et registres générés automatiquement par les hooks AdonisJS

Le SSR est désactivé par défaut et peut être activé dans `config/inertia.ts`.

## Vérifications

```sh
npm run typecheck
npm run lint
npm run build
```

Japa est configuré (`npm test`), mais le starter ne contient pas encore de tests.

## Image de production

```sh
docker build --target runner -t gpt-cloud-test .
```

L'image exécute les migrations avant de lancer le serveur. En production, fournir `APP_KEY`, `APP_URL`, `LOG_LEVEL` et les variables `DB_*` via le gestionnaire de secrets de la plateforme. Conserver `APP_KEY` entre les déploiements et sauvegarder régulièrement la base PostgreSQL.

Documentation : [installation AdonisJS](https://docs.adonisjs.com/installation) et [Inertia](https://docs.adonisjs.com/guides/frontend/inertia).
