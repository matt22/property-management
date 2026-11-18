import { useEffect, useRef } from "react";
import Icon from "@/components/icon";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function MetricCard({ label, value, detail, icon, tone }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-5 py-3 shadow-[0_2px_8px_rgba(32,52,45,0.025)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--ink-soft)]">
            {label}
          </p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.045em] text-[var(--ink)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">{detail}</p>
        </div>
        <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
    </article>
  );
}

export function WorkspaceSidebar({ firm }) {
  const infoRef = useRef(null);
  useEffect(() => {
    function outside(event) {
      if (infoRef.current && !infoRef.current.contains(event.target)) infoRef.current.open = false;
    }
    function escape(event) {
      if (event.key === "Escape" && infoRef.current?.open) {
        infoRef.current.open = false;
        infoRef.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  return (
      <aside className="flex w-full shrink-0 flex-col bg-[#293455] px-5 py-5 text-white lg:min-h-screen lg:w-[252px] lg:px-6 lg:py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#dbe7dd] text-[#244237]">
            <Icon name="layers" size={21} />
          </span>
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.04em]">acme <span className="ml-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/80">buggy version</span></p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
              property workspace
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <label htmlFor="site-picker" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Site</label>
            <details ref={infoRef} className="relative text-white/70">
              <summary aria-label="About site options" className="grid size-4 cursor-pointer list-none place-items-center rounded-full border border-white/50 text-[10px]">i</summary>
              <div className="absolute left-0 top-6 z-20 w-56 rounded-xl bg-white p-3 text-xs leading-5 text-[#20342d] shadow-lg">
                <button type="button" aria-label="Close site information" onClick={() => { infoRef.current.open = false; infoRef.current.querySelector("summary")?.focus(); }} className="float-right -mt-1 ml-2 grid size-7 place-items-center rounded text-lg hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#426c5c]">×</button>
                <p>Perfecto and Acme are separate workspaces with independent data. Acme contains bugs. Choose a site to switch between them.</p>
              </div>
            </details>
          </div>
          <span className="relative block">
          <select id="site-picker" value={process.env.NEXT_PUBLIC_SITE} onChange={(event) => { window.location.assign(`/${event.target.value}`); }} className="w-full appearance-none rounded-xl border border-white/20 bg-[#30483e] py-2 pl-3 pr-10 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <option value="perfecto">Perfecto</option>
            <option value="acme">Acme</option>
          </select>
          <Icon name="caret" size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
          </span>
        </div>

        <div className="mt-7 hidden lg:block">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Workspace
          </p>
          <a href="#portfolio-overview" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Icon name="grid" size={17} />
            Portfolio overview
          </a>
          <a href="#property-directory" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Icon name="building" size={17} />
            Property directory
          </a>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 lg:mt-auto lg:border-0 lg:pt-0">
          <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Data workspace
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#dce9dd] text-xs font-semibold text-[#325d4d]">
              {firm.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{firm.name}</p>
              <p className="mt-1 text-[11px] text-white/50">Portfolio data</p>
            </div>
            <Icon name="dots" size={16} className="text-white/50" />
          </div>
          <p className="mt-4 hidden px-1 text-[11px] leading-5 text-white/40 lg:block">
            Assignment changes save automatically.
          </p>
        </div>
      </aside>
  );
}

export function WorkspaceHeader({ firms, selectedFirmId, onSelectFirm }) {
  return (
        <header className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[var(--sage-dark)]">
              Portfolio management
            </p>
            <h1 className="mt-1 text-[30px] font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-[34px]">
              Portfolio overview
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-5 text-[var(--ink-soft)]">
              A clear view of the properties and portfolios your team is shaping.
            </p>
          </div>

          <label className="block min-w-64">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--ink-soft)]">
              Select a firm
            </span>
            <span className="relative block">
              <select
                className="h-10 w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--paper)] pl-4 pr-11 text-sm font-medium outline-none transition focus:border-[var(--sage-dark)] focus:ring-4 focus:ring-[#426c5c]/10"
                value={selectedFirmId}
                onChange={(event) => onSelectFirm(event.target.value)}
              >
                {firms.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <Icon
                name="caret"
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]"
              />
            </span>
          </label>
        </header>
  );
}

export function FirmMetrics({ metrics }) {
  return (
        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Firm summary">
          <MetricCard
            label="Properties"
            value={metrics.propertyCount}
            detail={`${metrics.totalUnits.toLocaleString()} residential & commercial units`}
            icon="building"
            tone="bg-[#e7efe8] text-[#426c5c]"
          />
          <MetricCard
            label="Portfolios"
            value={metrics.portfolioCount}
            detail="Curated investment groups"
            icon="layers"
            tone="bg-[#f5e9df] text-[#b36e4d]"
          />
          <MetricCard
            label="Assigned"
            value={`${metrics.assignedCount} / ${metrics.propertyCount}`}
            detail="Properties in at least one portfolio"
            icon="check"
            tone="bg-[#ece9f4] text-[#75668f]"
          />
          <MetricCard
            label="Portfolio value"
            value={money.format(metrics.totalValue)}
            detail={`${metrics.averageOccupancy}% average occupancy`}
            icon="spark"
            tone="bg-[#f7efe0] text-[#a47d38]"
          />
        </section>
  );
}

export function FirmPortfolios({ firm, portfolios }) {
  return (
        <section className="mt-4 rounded-[22px] border border-[var(--line)] bg-[var(--paper)] px-6 py-4 shadow-[0_4px_16px_rgba(32,52,45,0.025)] sm:px-8 sm:py-5">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#6e9b7f]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sage-dark)]">
                  Firm workspace
                </p>
              </div>
              <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.04em]">
                {firm.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{firm.location}</p>
            </div>
            <div className="rounded-xl bg-[#f4f4ee] px-4 py-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                Current view
              </p>
              <p className="mt-1 text-sm font-medium">{portfolios.length} portfolios</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {portfolios.map((portfolio, index) => (
              <article key={portfolio.id} className="rounded-2xl border border-[var(--line)] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#f2f4ee] text-[var(--sage-dark)]">
                    <Icon name="layers" size={17} />
                  </span>
                  <span className="rounded-full bg-[#f5f4ef] px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold tracking-[-0.02em]">{portfolio.name}</h3>
                <p className="mt-1 min-h-10 text-xs leading-5 text-[var(--ink-soft)]">
                  {portfolio.description}
                </p>
                <p className="mt-2 border-t border-[var(--line)] pt-2 text-xs font-medium">
                  {portfolio.propertyIds.length + 1} properties
                </p>
              </article>
            ))}
          </div>
        </section>
  );
}

