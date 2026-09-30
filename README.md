# AdonisJS 7 + Inertia + React

Base issue du [starter officiel React](https://github.com/adonisjs/starter-kits/tree/inertia-react), avec TypeScript, Vite, Lucid/SQLite et authentification par session.

## Prérequis

- Node.js 24 ou supérieur
- npm 11 ou supérieur

## Développement

Le projet est déjà installé, le fichier `.env` est configuré et les migrations sont appliquées localement.

```sh
npm run dev
```

Ouvrir <http://localhost:3333>.

Pour installer le projet depuis un nouveau clone :

```sh
npm ci
```

Copier `.env.example` vers `.env`, puis exécuter :

```sh
node ace generate:key
node ace migration:run
npm run dev
```

La base SQLite se trouve dans `tmp/db.sqlite3`. Le fichier `.env` et la base locale sont exclus de Git.

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

## Production

```sh
npm run build
cd build
npm ci --omit=dev
```

Configurer les variables d'environnement de production (dont `NODE_ENV=production`, `APP_KEY`, `APP_URL`, `HOST` et `PORT`), puis lancer :

```sh
node ace migration:run --force
npm start
```

Conserver `APP_KEY` et la base SQLite entre les déploiements.

Documentation : [installation AdonisJS](https://docs.adonisjs.com/installation) et [Inertia](https://docs.adonisjs.com/guides/frontend/inertia).
