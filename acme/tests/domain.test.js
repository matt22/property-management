import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { getFirmOverview, setPortfolioAssignment, validateStore } from "../lib/domain.js";
import { createJsonStore } from "../lib/json-store.js";

const seed = JSON.parse(
  await readFile(new URL("../data/seed.json", import.meta.url), "utf8"),
);

test("the sample file is a valid relational data set", () => {
  assert.equal(validateStore(seed), seed);
});

test("firm overview returns only its properties and portfolios", () => {
  const overview = getFirmOverview(seed, "firm-northstar");

  assert.equal(overview.properties.length, 12);
  for (const firm of seed.firms) {
    assert.equal(getFirmOverview(seed, firm.id).properties.length, 12);
  }
  assert.equal(overview.portfolios.length, 3);
  assert.equal(overview.portfolios[0].propertyIds.includes("property-cedar-house"), true);
  assert.equal(getFirmOverview(seed, "missing-firm"), null);
});

test("assignment can be added and removed without mutating the original data", () => {
  const originalCount = seed.portfolioProperties.length;
  const assigned = setPortfolioAssignment(seed, {
    firmId: "firm-northstar",
    portfolioId: "portfolio-urban-core",
    propertyId: "property-rainier-lofts",
    assigned: true,
  });

  assert.equal(assigned.portfolioProperties.length, originalCount + 1);
  assert.equal(seed.portfolioProperties.length, originalCount);

  const unassigned = setPortfolioAssignment(assigned, {
    firmId: "firm-northstar",
    portfolioId: "portfolio-urban-core",
    propertyId: "property-rainier-lofts",
    assigned: false,
  });

  assert.equal(unassigned.portfolioProperties.length, originalCount);
});

test("assignments cannot cross firm boundaries", () => {
  assert.throws(
    () =>
      setPortfolioAssignment(seed, {
        firmId: "firm-northstar",
        portfolioId: "portfolio-urban-core",
        propertyId: "property-lady-bird",
        assigned: true,
      }),
    /belong to the selected firm/,
  );
});

test("rolling back one assignment preserves a concurrent change", () => {
  const first = { firmId: "firm-northstar", portfolioId: "portfolio-urban-core", propertyId: "property-rainier-lofts", assigned: true };
  const second = { firmId: "firm-northstar", portfolioId: "portfolio-resident-first", propertyId: "property-olive-and-8th", assigned: true };
  const pending = setPortfolioAssignment(setPortfolioAssignment(seed, first), second);
  const rolledBack = setPortfolioAssignment(pending, { ...first, assigned: false });
  assert.equal(rolledBack.portfolioProperties.some((item) => item.portfolioId === first.portfolioId && item.propertyId === first.propertyId), false);
  assert.equal(rolledBack.portfolioProperties.some((item) => item.portfolioId === second.portfolioId && item.propertyId === second.propertyId), true);
});

test("JSON store initializes from the seed and persists updates", async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "perfecto-store-"));
  const dataFile = path.join(temporaryDirectory, "store.json");

  try {
    const store = createJsonStore({ dataFile });
    const initial = await store.read();
    assert.equal(initial.firms.length, seed.firms.length);

    await store.update((current) =>
      setPortfolioAssignment(current, {
        firmId: "firm-northstar",
        portfolioId: "portfolio-resident-first",
        propertyId: "property-olive-and-8th",
        assigned: true,
      }),
    );

    const saved = JSON.parse(await readFile(dataFile, "utf8"));
    assert.equal(
      saved.portfolioProperties.some(
        (assignment) =>
          assignment.portfolioId === "portfolio-resident-first" &&
          assignment.propertyId === "property-olive-and-8th",
      ),
      true,
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
