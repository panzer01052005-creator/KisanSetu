# KisanSetu

KisanSetu is a static farmer procurement experience with a small Node backend for local serving.

## Project structure

- `frontend/` contains the HTML pages, CSS, images, and browser JavaScript.
- `backend/` contains the Node HTTP server.
- `package.json` contains the local start command.

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

The backend serves files from `frontend/`, includes basic path traversal protection, and exposes the crop registration API. It uses an in-memory fallback when no database is configured.

## Database setup

The project is prepared for PostgreSQL. Create a database, set `DATABASE_URL`, and apply the schema:

```bash
export DATABASE_URL=postgres://user:password@localhost:5432/kisansetu
psql "$DATABASE_URL" -f backend/schema.sql
npm start
```

`GET /api/health` reports `database: "postgresql"` when the connection is working. Without `DATABASE_URL`, it reports `database: "memory"` so the frontend still runs locally without data persistence.

## Crop registration API

`POST /api/crop-registrations` accepts JSON with `crop`, `otherCrop` (when crop is `Other`), `quantity`, `unit`, `center`, `address`, `district`, and `pincode`. The server validates the request and currently stores it in memory for local development.

The SQL-ready repository accepts a parameterized `query` function, and the PostgreSQL table definition is in `backend/schema.sql`. Connect a PostgreSQL pool by passing its `query` method to `createCropRepository` in `backend/server.js`; the frontend API contract does not need to change.
