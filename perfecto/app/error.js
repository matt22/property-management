"use client";

export default function WorkspaceError({ reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] px-6 py-12">
      <section className="w-full max-w-md rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-8 text-center shadow-[0_10px_36px_rgba(32,52,45,0.06)]">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f6e9de] text-[#a86749]">
          <span aria-hidden="true" className="text-xl font-semibold">!</span>
        </span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--sage-dark)]">
          Workspace unavailable
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Let’s try that again</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
          The property workspace couldn’t load. Your saved file has not been changed by this screen.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 h-11 rounded-xl bg-[#244237] px-5 text-sm font-semibold text-white transition hover:bg-[#315a49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426c5c]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
