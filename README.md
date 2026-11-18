# Property workspaces

Perfecto and Acme are independent Next.js applications with separate data stores. Run each from its own directory; see each application's README for local setup.

## Deployment

Build and deploy `perfecto` and `acme` as separate Cloudflare Workers using their respective `npm run build:cloudflare` and `npx wrangler deploy` commands. Then deploy the public router from `router` with `../perfecto/node_modules/.bin/wrangler deploy`. Deploy both applications before the router so its service bindings resolve. Perfecto uses the existing D1 database; Acme uses its own D1 database. The router serves `/perfecto` and `/acme` and redirects other top-level paths to `/perfecto`.
