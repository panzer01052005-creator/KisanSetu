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
