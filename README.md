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

The backend serves files from `frontend/` and includes basic path traversal protection. It is intentionally dependency-free so it can later be extended with APIs for accounts, queues, orders, payments, and support.

## Crop registration API

`POST /api/crop-registrations` accepts JSON with `crop`, `otherCrop` (when crop is `Other`), `quantity`, `unit`, `center`, `address`, `district`, and `pincode`. The server validates the request and currently stores it in memory for local development.

The SQL-ready repository accepts a parameterized `query` function, and the PostgreSQL table definition is in `backend/schema.sql`. Connect a PostgreSQL pool by passing its `query` method to `createCropRepository` in `backend/server.js`; the frontend API contract does not need to change.
