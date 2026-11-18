# Folio property workspace

A Next.js workspace for reviewing a firm's properties and assigning each property to one or more portfolios.

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The first request creates `data/property-portfolio.json` from `data/seed.json`. Assignment changes are written to that local JSON file. The runtime file is ignored by Git, so the checked-in sample remains unchanged.

Restore the sample data with:

```bash
npm run data:reset
```

The reset command removes the runtime file. The next app request creates a fresh copy from the sample data.

## Data model

The JSON document has four collections:

- `firms` owns properties and portfolios.
- `properties` belongs to one firm.
- `portfolios` belongs to one firm.
- `portfolioProperties` stores the many-to-many property-to-portfolio relationship.

The domain layer checks IDs and relationship boundaries before changes are saved. The JSON store validates each read and write and uses an atomic file replacement for updates.

## Project layout

```text
app/          Next.js routes and server actions
components/   Workspace and assignment interface
data/         Sample data and local runtime JSON
lib/          Domain rules and JSON file storage
tests/        Domain and storage tests
```

## Useful commands

```bash
npm run lint
npm test
npm run build
npm run start
```

The JSON file is intended for local Node.js use. It is not durable storage for a serverless runtime; choose a persistent data service before deploying that way.
