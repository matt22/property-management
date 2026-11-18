"use client";

import { useMemo, useState } from "react";
import { AssignmentControls, AssignmentTable } from "@/components/assignment-parts";
import { filterProperties } from "@/lib/property-filters";

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

  const [occupancy, setOccupancy] = useState("all");

  const matchingProperties = useMemo(
    () => filterProperties(properties, { query, occupancy, assignment: filter, portfolios }),
    [filter, occupancy, portfolios, properties, query],
  );

  const unassignedCount = properties.filter(
    (property) => !portfolios.some((portfolio) => portfolio.propertyIds.includes(property.id)),
  ).length;

  return (
    <section id="property-directory" className="mt-4 overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--paper)] shadow-[0_4px_16px_rgba(32,52,45,0.025)]">
      <AssignmentControls isSaving={isSaving} saveMessage={saveMessage} properties={properties} unassignedCount={unassignedCount} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} occupancy={occupancy} setOccupancy={setOccupancy} />

      <AssignmentTable properties={properties} matchingProperties={matchingProperties} portfolios={portfolios} onToggle={onToggle} savingKeys={savingKeys} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[#fafaf6] px-6 py-2 text-[11px] text-[var(--ink-soft)]">
        <span>Showing {matchingProperties.length} of {properties.length} properties</span>
        <span>Properties can belong to multiple portfolios</span>
      </div>
    </section>
  );
}
