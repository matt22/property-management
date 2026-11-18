import seed from "../data/seed.json";
import { validateStore } from "./domain.js";

async function store() {
  if (process.env.CLOUDFLARE_DEPLOYMENT !== "true") {
    return (await import("./json-store.js")).propertyStore;
  }
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  return createD1Store(getCloudflareContext().env.PROPERTY_DB);
}

export function createD1Store(db) {
  async function readRow() {
    await db.prepare("CREATE TABLE IF NOT EXISTS property_store (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL, version INTEGER NOT NULL)").run();
    await db.prepare("INSERT OR IGNORE INTO property_store (id, data, version) VALUES (1, ?, 0)")
      .bind(JSON.stringify(seed)).run();
    return db.prepare("SELECT data, version FROM property_store WHERE id = 1").first();
  }

  async function read() {
    const row = await readRow();
    return validateStore(JSON.parse(row.data));
  }

  async function update(updater) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const row = await readRow();
      const next = validateStore(await updater(validateStore(JSON.parse(row.data))));
      const result = await db.prepare("UPDATE property_store SET data = ?, version = version + 1 WHERE id = 1 AND version = ?")
        .bind(JSON.stringify(next), row.version).run();
      if (result.meta.changes === 1) return next;
    }
    throw new Error("The data changed repeatedly. Please try again.");
  }
  return { read, update };
}

export const propertyStore = {
  async read() { return (await store()).read(); },
  async update(updater) { return (await store()).update(updater); },
};
