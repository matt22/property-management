export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[var(--canvas)] px-5 py-8 sm:px-8 lg:px-10"
      aria-label="Loading property workspace"
      aria-busy="true"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="flex items-center gap-3">
          <span className="size-10 animate-pulse rounded-[14px] bg-[#dce6dc]" />
          <span className="h-4 w-24 animate-pulse rounded-full bg-[#dfe3dc]" />
        </div>
        <div className="mt-12 h-8 w-64 animate-pulse rounded-lg bg-[#e3e5de]" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-[#e8e9e3]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--paper)]" />
          ))}
        </div>
        <div className="mt-7 h-[480px] animate-pulse rounded-[22px] border border-[var(--line)] bg-[var(--paper)]" />
        <p className="sr-only" role="status">Loading portfolio data…</p>
      </div>
    </main>
  );
}
