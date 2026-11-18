import { randomUUID } from "node:crypto";
import { COPYFILE_EXCL } from "node:fs";
import { copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateStore } from "./domain.js";

const DEFAULT_SEED_PATH = fileURLToPath(new URL("../data/seed.json", import.meta.url));

export function createJsonStore({ dataFile, seedFile = DEFAULT_SEED_PATH } = {}) {
  const resolvedDataFile = path.resolve(
    dataFile ?? path.join(process.cwd(), "data", "property-portfolio.json"),
  );
  let writeQueue = Promise.resolve();

  async function ensureDataFile() {
    await mkdir(path.dirname(resolvedDataFile), { recursive: true });

    try {
      await copyFile(seedFile, resolvedDataFile, COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }

  async function read() {
    await ensureDataFile();
    const contents = await readFile(resolvedDataFile, "utf8");

    let store;
    try {
      store = JSON.parse(contents);
    } catch (error) {
      throw new Error(`Could not parse property data at ${resolvedDataFile}.`, { cause: error });
    }

    return validateStore(store);
  }

  async function write(store) {
    const temporaryFile = `${resolvedDataFile}.${randomUUID()}.tmp`;
    const contents = `${JSON.stringify(store, null, 2)}\n`;

    try {
      await writeFile(temporaryFile, contents, { encoding: "utf8", flag: "wx" });
      await rename(temporaryFile, resolvedDataFile);
    } finally {
      await rm(temporaryFile, { force: true });
    }
  }

  function update(updater) {
    const operation = writeQueue.then(async () => {
      const current = await read();
      const next = await updater(current);
      validateStore(next);
      await write(next);
      return next;
    });

    writeQueue = operation.catch(() => undefined);
    return operation;
  }

  return { read, update };
}

export const propertyStore = createJsonStore();
