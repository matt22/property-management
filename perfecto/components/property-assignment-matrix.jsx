"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/icon";

function PropertyMark({ name, index }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const tones = ["bg-[#e8efe8] text-[#426c5c]", "bg-[#f6e9de] text-[#ad704f]", "bg-[#eeebf5] text-[#766891]"];

  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-[13px] text-xs font-semibold ${tones[index % tones.length]}`}>
      {initials}
    </span>
  );
}

export default function PropertyAssignmentMatrix({ properties, portfolios, onToggle }) {
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
    <section className="mt-6 overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--paper)] shadow-[0_4px_16px_rgba(32,52,45,0.025)]">
      <div className="flex flex-col gap-5 border-b border-[var(--line)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.035em]">Property assignments</h2>
            <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
              Add a property to one or more portfolios with a checkbox.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#e9f1eb] px-3 py-1.5 text-[11px] font-medium text-[#426c5c]">
            <Icon name="check" size={14} />
            Changes update instantly
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2" aria-label="Filter properties">
            {[
              ["all", "All properties", properties.length],
              ["unassigned", "Unassigned", unassignedCount],
              ["assigned", "In a portfolio", properties.length - unassignedCount],
            ].map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`rounded-full px-3 py-2 text-[11px] font-medium transition ${
                  filter === value
                    ? "bg-[#203a30] text-white"
                    : "bg-[#f3f3ed] text-[var(--ink-soft)] hover:bg-[#ebede5]"
                }`}
              >
                {label} <span className="ml-1 opacity-65">{count}</span>
              </button>
            ))}
          </div>
          <label className="relative block w-full sm:max-w-[260px]">
            <span className="sr-only">Search properties</span>
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85918a]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a property"
              className="h-10 w-full rounded-xl border border-[var(--line)] bg-white pl-10 pr-3 text-xs outline-none transition placeholder:text-[#9aa39d] focus:border-[var(--sage-dark)] focus:ring-4 focus:ring-[#426c5c]/10"
            />
          </label>
        </div>
      </div>

      {matchingProperties.length === 0 ? (
        <div className="grid min-h-48 place-items-center px-6 py-12 text-center">
          <div>
            <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[#f2f3ed] text-[var(--sage-dark)]">
              <Icon name="search" size={19} />
            </span>
            <p className="mt-4 text-sm font-semibold">No properties match</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">Try a different name or filter.</p>
          </div>
        </div>
      ) : (
        <div className="scrollbar-subtle overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#fafaf6] text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--ink-soft)]">
                <th scope="col" className="sticky left-0 z-10 min-w-[320px] border-b border-[var(--line)] bg-[#fafaf6] px-6 py-4">
                  Property
                </th>
                <th scope="col" className="min-w-[145px] border-b border-[var(--line)] px-4 py-4">
                  Occupancy
                </th>
                {portfolios.map((portfolio) => (
                  <th key={portfolio.id} scope="col" className="min-w-[135px] border-b border-[var(--line)] px-3 py-4 text-center normal-case tracking-normal">
                    <span className="mx-auto block max-w-[120px] truncate text-[11px] font-semibold text-[var(--ink)]">
                      {portfolio.name}
                    </span>
                    <span className="mt-1 block text-[10px] font-normal text-[var(--ink-soft)]">
                      {portfolio.propertyIds.length} properties
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchingProperties.map((property, index) => {
                const portfolioCount = portfolios.filter((portfolio) =>
                  portfolio.propertyIds.includes(property.id),
                ).length;

                return (
                  <tr key={property.id} className="group transition hover:bg-[#fbfbf8]">
                    <th scope="row" className="sticky left-0 z-[1] border-b border-[var(--line)] bg-[var(--paper)] px-6 py-4 text-left group-hover:bg-[#fbfbf8]">
                      <div className="flex items-center gap-3">
                        <PropertyMark name={property.name} index={index} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--ink)]">
                            {property.name}
                          </p>
                          <p className="mt-1 truncate text-[11px] font-normal text-[var(--ink-soft)]">
                            {property.address} <span className="mx-1.5 text-[#ccd1ca]">·</span>{property.type}
                          </p>
                        </div>
                      </div>
                    </th>
                    <td className="border-b border-[var(--line)] px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="relative h-1.5 w-12 overflow-hidden rounded-full bg-[#e9ece6]">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full bg-[#79a58a]"
                            style={{ width: `${property.occupancy}%` }}
                          />
                        </span>
                        <span className="text-xs font-medium tabular-nums">{property.occupancy}%</span>
                      </div>
                      <p className="mt-1.5 text-[10px] text-[var(--ink-soft)]">
                        {portfolioCount ? `${portfolioCount} portfolio${portfolioCount === 1 ? "" : "s"}` : "Not assigned"}
                      </p>
                    </td>
                    {portfolios.map((portfolio) => {
                      const checked = portfolio.propertyIds.includes(property.id);

                      return (
                        <td key={portfolio.id} className="border-b border-[var(--line)] px-3 py-4 text-center">
                          <label className="inline-grid min-h-10 min-w-10 cursor-pointer place-items-center rounded-xl transition hover:bg-[#f1f4ef]">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => onToggle(portfolio.id, property.id, event.target.checked)}
                              aria-label={`${checked ? "Remove" : "Add"} ${property.name} ${checked ? "from" : "to"} ${portfolio.name}`}
                              className="size-[17px] cursor-pointer accent-[#426c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426c5c]"
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[#fafaf6] px-6 py-3.5 text-[11px] text-[var(--ink-soft)]">
        <span>Showing {matchingProperties.length} of {properties.length} properties</span>
        <span>Properties can belong to multiple portfolios</span>
      </div>
    </section>
  );
}
