"use client";

import { useMemo, useState } from "react";
import { AssignmentControls, AssignmentTable } from "@/components/assignment-parts";

export default function PropertyAssignmentMatrix({
  properties,
  portfolios,
  onToggle,
  savingKeys,
  saveMessage,
}) {
  const isSaving = savingKeys.size > 0;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const matchingProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return properties.filter((property) => {
      const assignedCount = portfolios.filter((portfolio) =>
        portfolio.propertyIds.includes(property.id),
      ).length;
      const matchesFilter =
        filter === "all" || (filter === "assigned" ? assignedCount > 0 : assignedCount === 0);
      const matchesQuery =
        !normalizedQuery ||
        `${property.name} ${property.address} ${property.type}`.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, portfolios, properties, query]);

  const unassignedCount = properties.filter(
    (property) => !portfolios.some((portfolio) => portfolio.propertyIds.includes(property.id)),
  ).length;

  return (
    <section id="property-directory" className="mt-6 overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--paper)] shadow-[0_4px_16px_rgba(32,52,45,0.025)]">
      <AssignmentControls isSaving={isSaving} saveMessage={saveMessage} properties={properties} unassignedCount={unassignedCount} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} />

      <AssignmentTable properties={properties} matchingProperties={matchingProperties} portfolios={portfolios} onToggle={onToggle} savingKeys={savingKeys} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[#fafaf6] px-6 py-3.5 text-[11px] text-[var(--ink-soft)]">
        <span>Showing {matchingProperties.length} of {properties.length} properties</span>
        <span>Properties can belong to multiple portfolios</span>
      </div>
    </section>
  );
}
