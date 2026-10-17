# AI Log

Changes made with Claude Code on 2026-10-17.

## 1. Connecting the API to Postgres

**Prompt:** "connect to my folder then fix it for me"

**Problem:** the NestJS app could not connect to the database.

### What went wrong, step by step

1. **`npm install` warnings.** These came from running Node 25 and were harmless. Nothing needed fixing.
2. **`docker compose up` failed.** The project has no `docker-compose.yml`, so the database was started as a plain container instead: `todo-db` from the `postgres:16` image, with `POSTGRES_PASSWORD=postgres` and `POSTGRES_DB=todo`.
3. **"role postgres does not exist".** A separate Postgres installed directly on the Mac was already listening on `localhost:5432`. The app was talking to that one instead of the Docker container, and it has no `postgres` user. The fix was to recreate the `todo-db` container on host port **5433** (`-p 5433:5432`) so the two don't clash. The Mac Postgres was left untouched.
4. **Wrong database name.** `src/app.module.ts` already used port 5433, but it asked for a database called `todo-db`. That is the container's name; the database inside it is called `todo`.

### Change made

In `src/app.module.ts`, inside `TypeOrmModule.forRoot`:

- `database: "todo-db"` → `database: "todo"`
- `host: "localhost"` → `host: "127.0.0.1"`, so the connection always uses IPv4 and reaches the Docker port mapping.

Final settings: host `127.0.0.1`, port `5433`, user `postgres`, password `postgres`, database `todo`.

### Verification

- `npm run start:dev` reloaded and TypeORM started with no connection errors.
- `GET http://localhost:3000/todos` returned HTTP 200.

### Still to do

- The `todo` database has no tables yet and `synchronize` is `false`. The `/todos` routes currently return placeholder text, so this doesn't show yet. Once they use the database, create the table or set `synchronize: true` during development.

## 2. Finishing the Database setup lab and connecting React

**Prompt:** the "Lab · Database setup" slides (complete the lab in todo-api and connect todo-app).

### Changes in todo-api

- `todos.service.ts`: now uses the TypeORM repository. Added `update` (loads the row, merges the changes, saves) and `remove`. Both return **404** when the id doesn't exist.
- `todos.controller.ts`: `ParseIntPipe` on every `:id`. `remove` now **returns** the service promise, otherwise a missing id would still answer 204.
- `todos.module.ts`: `TypeOrmModule.forFeature([Todo])`.
- New `profile/` resource, generated with `nest g resource profile` (REST, CRUD) and filled in like todos: `Profile` entity (`id`, `name`, `email`, `role`), `CreateProfileDto` with validation, `UpdateProfileDto` as `PartialType`, and `POST`, `GET`, `GET :id`, `PATCH :id`, `DELETE :id` under `/api/profile`, with 404 for a missing id.
- `main.ts`: `setGlobalPrefix('api')`, `ValidationPipe({ whitelist: true })`, CORS for `http://localhost:5173`.
- The todos and profile spec files get a fake repository so they can still build the module.
- DB settings unchanged: `127.0.0.1:5433`, database `todo`.

### Changes in todo-app

- New `src/api.js` with one function per endpoint, pointing at `http://localhost:3000/api`.
- `App.jsx` loads todos and the first profile on start (it creates a default profile if there is none), and add, edit, status change, delete, bulk actions and profile save all go through the API. Errors show in a red banner.
- `constants.js` converts between the API codes (`TODO`, `IN_PROGRESS`, `DONE`) and the UI labels.
- Starred and drag order still only live in the browser; those are bonus endpoints.

### Still to do

- Generate and run the profile migration (`npm run typeorm -- migration:generate src/migrations/profile -d src/data-source.ts`, then `migration:run`).
