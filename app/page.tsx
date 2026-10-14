"use client";

import * as React from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Compass,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { AfterView } from "@/components/views/after-view";
import { BeforeView } from "@/components/views/before-view";
import { ToastProvider } from "@/components/toast";
import { cn } from "@/lib/utils";

type Mode = "before" | "after";

export default function Page() {
  const [mode, setMode] = React.useState<Mode>("after");

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "b" || e.key === "B") setMode("before");
      if (e.key === "a" || e.key === "A") setMode("after");
      if (e.key === " ") {
        e.preventDefault();
        setMode((m) => (m === "before" ? "after" : "before"));
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ToastProvider>
      {/* Prototype banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-ink-900 px-4 py-1.5 text-[11px] font-medium text-amber-200">
        <span className="rounded-sm bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-900">
          Prototype
        </span>
        <span className="text-ink-200">
          Non-functional demo · fictional brand · for discussion only
        </span>
        <span className="hidden text-ink-400 sm:inline">
          · press <kbd className="rounded bg-ink-700 px-1 text-ink-200">Space</kbd>{" "}
          to toggle
        </span>
      </div>

      {/* App chrome */}
      <header className="sticky top-[26px] z-40 border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-2.5">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-md bg-brand-600 text-white">
              <Compass className="size-4" />
            </div>
            <span className="font-semibold tracking-tight text-ink-900">
              Beacon Commerce
            </span>
            <span className="hidden rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] text-ink-500 sm:inline">
              v2.4 — demo tenant
            </span>
          </div>

          <nav className="ml-6 hidden items-center gap-1 text-sm md:flex">
            <NavItem>Dashboard</NavItem>
            <NavItem active>Orders</NavItem>
            <NavItem>Invoices</NavItem>
            <NavItem>Products</NavItem>
            <NavItem>Customers</NavItem>
            <NavItem>Reports</NavItem>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <IconBtn><LayoutGrid className="size-4" /></IconBtn>
            <IconBtn><Bell className="size-4" /></IconBtn>
            <IconBtn><CircleHelp className="size-4" /></IconBtn>
            <IconBtn><Settings className="size-4" /></IconBtn>
            <button className="ml-1 flex items-center gap-1.5 rounded-md border border-ink-200 bg-white py-1 pl-1 pr-2 text-xs text-ink-700 hover:bg-ink-50">
              <span className="grid size-6 place-items-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-700">
                MB
              </span>
              <span className="hidden sm:inline">M. Berg</span>
              <ChevronDown className="size-3.5 text-ink-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-6">
        {/* Page title + toggle */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Operations · Orders
            </div>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-ink-900">
              Orders
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink-500">
              Same screen, same data, same operations.{" "}
              <strong className="text-ink-700">Preserve → Simplify.</strong> Toggle
              to compare the legacy layout with a simplified one.
            </p>
          </div>

          <Toggle mode={mode} setMode={setMode} />
        </div>

        {mode === "before" ? <BeforeView /> : <AfterView />}

        {/* Footer compare notes */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat
            label="Columns shown"
            before="13"
            after="7"
            note="Same data; secondary fields moved to the side panel."
          />
          <Stat
            label="Clicks to approve an order"
            before="5"
            after="1"
            note="Select → scroll → Actions → Approve → confirm  →  one inline button."
          />
          <Stat
            label="Toolbar buttons on first paint"
            before="13"
            after="3"
            note="Same actions; rare ones live in “More” and the row menu."
          />
        </div>
      </main>

      <footer className="mx-auto max-w-[1400px] px-5 pb-10 pt-4 text-xs text-ink-400">
        Fictional brand for a design demo. Nothing you click is persisted.
      </footer>
    </ToastProvider>
  );
}

function Toggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-ink-200 bg-white p-1 shadow-sm">
      {(["before", "after"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            "relative h-8 min-w-24 rounded-md px-3 text-sm font-medium transition-colors",
            mode === m
              ? "bg-ink-900 text-white"
              : "text-ink-500 hover:text-ink-800"
          )}
        >
          {m === "before" ? "Before" : "After"}
          {mode === m && (
            <span className="ml-1.5 inline-block rounded-sm bg-white/20 px-1 text-[10px] uppercase tracking-wide">
              Live
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function NavItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "bg-ink-100 text-ink-900"
          : "text-ink-600 hover:bg-ink-50 hover:text-ink-800"
      )}
    >
      {children}
    </button>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex size-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-800">
      {children}
    </button>
  );
}

function Stat({
  label,
  before,
  after,
  note,
}: {
  label: string;
  before: string;
  after: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-xl text-ink-400 line-through">
          {before}
        </span>
        <span className="text-ink-400">→</span>
        <span className="font-mono text-2xl font-semibold text-ink-900">
          {after}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-ink-500">{note}</p>
    </div>
  );
}
