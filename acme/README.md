# Acme property workspace

A Next.js workspace for reviewing a firm's properties and assigning each property to one or more portfolios.

## Run locally

Use Node.js 22.12 or newer and npm. Run these commands from this application’s directory. Wrangler, included with the development dependencies, requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/acme](http://localhost:3000/acme).

The first request creates `data/property-portfolio.json` from `data/seed.json`. Assignment changes are written to that local JSON file. The runtime file is ignored by Git, so the checked-in sample remains unchanged.

Restore the sample data with:

```bash
npm run data:reset
```

The reset command deletes the runtime file and any local assignment changes in it. The next app request creates a fresh copy from the sample data.

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

Acme intentionally contains five known defects; see [the defect guide](docs/defects/README.md). Its occupancy boundary test currently fails because of one of these defects.

Both applications use port 3000 by default. To run them at the same time, start the second with `npm run dev -- --port 3001` and use that port in its URL. Run `npm run build` before `npm run start`; the production server also defaults to port 3000.

## Cloudflare deployment

Cloudflare Workers builds use OpenNext and store assignments in the bound D1 database. The database initializes from the sample data on its first request; subsequent deployments preserve its contents. Locally, the app continues to use the JSON file described above. Build the Worker with `npm run build:cloudflare`.

The app has no authentication or user isolation. Anyone who can reach the deployment can view and change its shared data, so use only sample data until access controls are added.
