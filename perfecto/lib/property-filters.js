export function matchesPropertySearch(property, query) {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || `${property.name} ${property.address} ${property.type}`.toLowerCase().includes(normalizedQuery);
}

export function matchesOccupancy(property, range) {
  const occupancy = property.occupancy;
  switch (range) {
    case "100": return occupancy === 100;
    case "97": return occupancy >= 97 && occupancy < 100;
    case "95": return occupancy >= 95 && occupancy < 97;
    case "90": return occupancy >= 90 && occupancy < 95;
    case "below90": return occupancy < 90;
    default: return true;
  }
}

export function matchesAssignment(property, portfolios, filter) {
  const assigned = portfolios.some((portfolio) => portfolio.propertyIds.includes(property.id));
  return filter === "all" || (filter === "assigned" ? assigned : !assigned);
}

export function filterProperties(properties, { query, occupancy, assignment, portfolios }) {
  return properties.filter((property) =>
    matchesPropertySearch(property, query) &&
    matchesOccupancy(property, occupancy) &&
    matchesAssignment(property, portfolios, assignment),
  );
}
