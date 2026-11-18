"use client";

import { useMemo, useState } from "react";
import { WorkspaceSidebar, WorkspaceHeader, FirmMetrics, FirmPortfolios } from "@/components/workspace-sections";
import PropertyAssignmentMatrix from "@/components/property-assignment-matrix";
import { getFirmOverview } from "@/lib/domain";
import { usePortfolioAssignments } from "@/lib/use-portfolio-assignments";

export default function PortfolioWorkspace({ initialData }) {
  const [selectedFirmId, setSelectedFirmId] = useState(initialData.firms[0]?.id ?? "");
  const { data, savingKeys, saveMessage, handleToggle } = usePortfolioAssignments(initialData, selectedFirmId);
  const overview = useMemo(
    () => getFirmOverview(data, selectedFirmId),
    [data, selectedFirmId],
  );

  if (!overview) return null;

  const { firm, metrics, portfolios } = overview;

  return (
    <div className="min-h-screen bg-[var(--canvas)] lg:flex">
      <WorkspaceSidebar firm={firm} />

      <main id="portfolio-overview" className="min-w-0 flex-1 px-5 pb-10 pt-7 sm:px-8 lg:px-10 lg:pt-9">
        <WorkspaceHeader firms={initialData.firms} selectedFirmId={selectedFirmId} onSelectFirm={setSelectedFirmId} />

        <FirmMetrics metrics={metrics} />

        <FirmPortfolios firm={firm} portfolios={portfolios} />

        <PropertyAssignmentMatrix
          properties={overview.properties}
          portfolios={portfolios}
          onToggle={handleToggle}
          savingKeys={savingKeys}
          saveMessage={saveMessage}
        />
      </main>
    </div>
  );
}
