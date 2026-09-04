# KisanSetu

KisanSetu is a static farmer procurement experience with a small Node backend backed by MongoDB.

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

## Production deployment

The app can run on any Node 20 host or container platform. Set these environment variables in the deployment service:

```text
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/kisansetu
ALLOW_MEMORY_STORAGE=false
GOOGLE_MAPS_API_KEY=your-browser-restricted-google-maps-key
```

## Google Maps setup

Create a Google Cloud API key with Maps JavaScript API, Places API, and Geocoding API enabled. Restrict the key to the deployed website origins, then set `GOOGLE_MAPS_API_KEY` in the server environment. The registration page uses the key for place search and the in-page collection-center map; without it, browser geolocation and the center list remain available but the map search is disabled.

### Docker deployment

Build and run the image with runtime environment variables. Do not copy a `.env` file into the image or commit one to the repository.

```bash
docker build -t kisansetu .
docker run -p 3000:3000 \
	-e NODE_ENV=production \
	-e PORT=3000 \
	-e MONGO_URI="$MONGO_URI" \
	-e ALLOW_MEMORY_STORAGE=false \
	-e GOOGLE_MAPS_API_KEY="$GOOGLE_MAPS_API_KEY" \
	kisansetu
```

Configure the same variables as protected secrets in your hosting provider. The `.dockerignore` file excludes `.env` files, including `backend/.env`, from the build context.

`MONGODB_URI` is also accepted as an alias for `MONGO_URI`. A MongoDB Atlas API key is not a database connection string and cannot be used in either variable.

The included `Dockerfile` starts the app as a non-root user. The platform should route its public port to the value of `PORT` and use `GET /api/health` as its health check. Do not set `ALLOW_MEMORY_STORAGE=true` in production because memory data is lost on restart.

## Database setup

Create a MongoDB database, add its connection string as `MONGO_URI`, and start the app:

```bash
export MONGO_URI=mongodb://localhost:27017/kisansetu
npm start
```

`GET /api/health` reports `database: "mongodb"` when the connection is working. For local development, omit `MONGO_URI` and set `ALLOW_MEMORY_STORAGE=true`; it reports `database: "memory"` and does not persist data.

## Crop registration API

`POST /api/crop-registrations` accepts JSON with `crop`, `otherCrop` (when crop is `Other`), `quantity`, `unit`, `center`, `address`, `district`, and `pincode`. The server validates the request and currently stores it in memory for local development.

User accounts and crop registrations are stored in MongoDB through the Mongoose models defined in the repositories. The frontend API contract does not need to change.
