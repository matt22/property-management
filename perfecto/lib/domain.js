const COLLECTIONS = ["firms", "properties", "portfolios", "portfolioProperties"];

export function validateStore(store) {
  if (!store || store.schemaVersion !== 1) {
    throw new Error("The property data file has an unsupported schema version.");
  }

  for (const collection of COLLECTIONS) {
    if (!Array.isArray(store[collection])) {
      throw new Error(`The property data file is missing the ${collection} collection.`);
    }
  }

  const firms = new Map();
  for (const firm of store.firms) {
    if (!firm.id || !firm.name || firms.has(firm.id)) {
      throw new Error("Every firm needs a unique ID and a name.");
    }
    firms.set(firm.id, firm);
  }

  const properties = new Map();
  for (const property of store.properties) {
    if (
      !property.id ||
      !property.name ||
      !firms.has(property.firmId) ||
      properties.has(property.id)
    ) {
      throw new Error("Every property needs a unique ID, a name, and a valid firm.");
    }
    properties.set(property.id, property);
  }

  const portfolios = new Map();
  for (const portfolio of store.portfolios) {
    if (
      !portfolio.id ||
      !portfolio.name ||
      !firms.has(portfolio.firmId) ||
      portfolios.has(portfolio.id)
    ) {
      throw new Error("Every portfolio needs a unique ID, a name, and a valid firm.");
    }
    portfolios.set(portfolio.id, portfolio);
  }

  const seenAssignments = new Set();
  for (const assignment of store.portfolioProperties) {
    const portfolio = portfolios.get(assignment.portfolioId);
    const property = properties.get(assignment.propertyId);
    const pairKey = `${assignment.portfolioId}:${assignment.propertyId}`;

    if (
      !portfolio ||
      !property ||
      portfolio.firmId !== property.firmId ||
      seenAssignments.has(pairKey)
    ) {
      throw new Error("Portfolio assignments must connect unique properties from the same firm.");
    }
    seenAssignments.add(pairKey);
  }

  return store;
}

export function getFirmOverview(store, firmId) {
  validateStore(store);

  const firm = store.firms.find((item) => item.id === firmId);
  if (!firm) return null;

  const properties = store.properties.filter((item) => item.firmId === firmId);
  const portfolios = store.portfolios
    .filter((item) => item.firmId === firmId)
    .map((portfolio) => ({
      ...portfolio,
      propertyIds: store.portfolioProperties
        .filter((assignment) => assignment.portfolioId === portfolio.id)
        .map((assignment) => assignment.propertyId),
    }));
  const assignedPropertyIds = new Set(
    store.portfolioProperties
      .filter((assignment) => portfolios.some((portfolio) => portfolio.id === assignment.portfolioId))
      .map((assignment) => assignment.propertyId),
  );

  return {
    firm,
    properties,
    portfolios,
    metrics: {
      propertyCount: properties.length,
      portfolioCount: portfolios.length,
      assignedCount: assignedPropertyIds.size,
      totalUnits: properties.reduce((sum, property) => sum + property.units, 0),
      totalValue: properties.reduce((sum, property) => sum + property.value, 0),
      averageOccupancy: properties.length
        ? Math.round(properties.reduce((sum, property) => sum + property.occupancy, 0) / properties.length)
        : 0,
    },
  };
}

export function setPortfolioAssignment(store, { firmId, portfolioId, propertyId, assigned }) {
  validateStore(store);

  if (typeof assigned !== "boolean") {
    throw new Error("Assignment state must be true or false.");
  }

  const portfolio = store.portfolios.find((item) => item.id === portfolioId);
  const property = store.properties.find((item) => item.id === propertyId);
  if (
    !portfolio ||
    !property ||
    portfolio.firmId !== firmId ||
    property.firmId !== firmId
  ) {
    throw new Error("Choose a portfolio and property that belong to the selected firm.");
  }

  const exists = store.portfolioProperties.some(
    (assignment) =>
      assignment.portfolioId === portfolioId && assignment.propertyId === propertyId,
  );

  if (exists === assigned) return store;

  const portfolioProperties = assigned
    ? [...store.portfolioProperties, { portfolioId, propertyId }]
    : store.portfolioProperties.filter(
        (assignment) =>
          assignment.portfolioId !== portfolioId || assignment.propertyId !== propertyId,
      );

  return { ...store, portfolioProperties };
}
