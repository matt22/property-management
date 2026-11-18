# Property workspaces

Perfecto and Acme are independent Next.js applications with separate data stores. Run each from its own directory; see the [Perfecto README](perfecto/README.md) and [Acme README](acme/README.md) for local setup. Both default to port 3000, so use a different port when running them together.

Acme intentionally contains five known defects and its test suite has a known failure; see the [defect guide](acme/docs/defects/README.md). Perfecto is the baseline application. Neither application has authentication: anyone who can reach a deployment can view and change its shared data.

## Deployment

Build and deploy `perfecto` and `acme` as separate Cloudflare Workers using their respective `npm run build:cloudflare` and `npx wrangler deploy` commands. Then deploy the public router from `router` with `../perfecto/node_modules/.bin/wrangler deploy`. Deploy both applications before the router so its service bindings resolve. The checked-in D1 database IDs refer to the original Cloudflare account. A new owner must create separate D1 databases in their own account and update the IDs in each application’s `wrangler.jsonc` before deployment. The Workers and router must be deployed to the same account, and the router service names must match the application Worker names. The router serves `/perfecto` and `/acme` and redirects other top-level paths to `/perfecto`.
