# AdonisJS 7 + Inertia + React

Base issue du [starter officiel React](https://github.com/adonisjs/starter-kits/tree/inertia-react), avec TypeScript, Vite, Lucid/PostgreSQL et authentification par session.

## Prérequis

- Node.js 24 et npm 11
- Docker avec le plugin Compose

## Développement

Docker Compose lance uniquement PostgreSQL 17. L'application AdonisJS s'exécute directement dans l'environnement de développement Node.js, avec rechargement à chaud.

Pour installer et configurer le projet depuis un nouveau clone :

```sh
cp .env.example .env
npm ci
```

Générer une clé d'application et la reporter dans `APP_KEY` du fichier `.env` :

```sh
node ace generate:key --show
```

Lancer PostgreSQL, appliquer les migrations puis démarrer l'application en mode développement :

```sh
docker compose up -d --wait
node ace migration:run
npm start
```

Ouvrir <http://localhost:3333>.

`npm start` lance le serveur AdonisJS en mode développement avec HMR. La commande `npm run dev` reste disponible comme alias.

Pour vérifier l'état de PostgreSQL, consulter ses journaux ou l'arrêter :

```sh
docker compose ps
docker compose logs -f postgres
docker compose down
```

Le volume Docker `postgres_data` conserve les données entre les redémarrages. `docker compose down -v` supprime également ces données et ne doit être utilisé que pour réinitialiser volontairement la base. Le fichier `.env` est exclu de Git.

## Pages et organisation

- `/` : accueil Inertia
- `/weather` : météo actuelle de Paris via Open-Meteo
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

## Exécution en production

```sh
npm run build
npm run start:prod
```

Appliquer les migrations avec `node ace migration:run --force` au moment du déploiement. En production, fournir `APP_KEY`, `APP_URL`, `LOG_LEVEL` et les variables `DB_*` via le gestionnaire de secrets de la plateforme. Conserver `APP_KEY` entre les déploiements et sauvegarder régulièrement la base PostgreSQL.

Documentation : [installation AdonisJS](https://docs.adonisjs.com/installation) et [Inertia](https://docs.adonisjs.com/guides/frontend/inertia).
