import { rm } from "node:fs/promises";
import path from "node:path";

const dataFile = path.resolve("data", "property-portfolio.json");
await rm(dataFile, { force: true });
console.log("Local portfolio data reset. The sample file will be copied on the next app request.");
