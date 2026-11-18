import { test } from "node:test";
import assert from "node:assert/strict";
import { filterProperties, matchesOccupancy } from "../lib/property-filters.js";

test("occupancy bands cover boundary values without overlap", () => {
  const bands = ["100", "97", "95", "90", "below90"];
  for (const [value, expected] of [[100, "100"], [99.9, "97"], [97, "97"], [96.9, "95"], [95, "95"], [94.9, "90"], [90, "90"], [89.9, "below90"]]) {
    assert.deepEqual(bands.filter((band) => matchesOccupancy({ occupancy: value }, band)), [expected]);
  }
});

test("search, occupancy and assignment filters must all match", () => {
  const properties = [
    { id: "a", name: "Cedar House", address: "Pine Street", type: "Multifamily", occupancy: 96 },
    { id: "b", name: "Cedar Court", address: "Oak Street", type: "Multifamily", occupancy: 96 },
    { id: "c", name: "Cedar Place", address: "Pine Street", type: "Multifamily", occupancy: 89 },
  ];
  const portfolios = [{ propertyIds: ["a", "c"] }];
  assert.deepEqual(filterProperties(properties, { query: " CEDAR ", occupancy: "95", assignment: "assigned", portfolios }).map((p) => p.id), ["a"]);
  assert.deepEqual(filterProperties(properties, { query: "pine", occupancy: "95", assignment: "unassigned", portfolios }), []);
});
