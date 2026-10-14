"use client";

import * as React from "react";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Bell,
  Calendar,
  ChevronDown,
  CircleHelp,
  Columns3,
  Copy,
  Download,
  FileSpreadsheet,
  Filter,
  Mail,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings2,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { ORDERS } from "@/lib/data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/toast";

/**
 * Deliberately dense legacy-ERP layout:
 *  - 13 visible columns
 *  - 15+ toolbar buttons
 *  - permanent filter rail with 10 filters
 *  - status rendered as plain text
 *  - every row row has 5 inline action icons
 *  - approving = select → scroll → open Actions dropdown → Approve → confirm modal
 */
export function BeforeView() {
  const { show } = useToast();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<string>("date");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [confirm, setConfirm] = React.useState<null | {
    id: string;
    action: string;
  }>(null);
  const [actionsOpen, setActionsOpen] = React.useState<string | null>(null);

  const sorted = React.useMemo(() => {
    const copy = [...ORDERS];
    copy.sort((a, b) => {
      // deterministic string compare — "good enough" for a prototype
      const av = (a as any)[sortKey] ?? "";
      const bv = (b as any)[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [sortKey, sortDir]);

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function requestAction(id: string, action: string) {
    setConfirm({ id, action });
    setActionsOpen(null);
  }

  function confirmAction() {
    if (!confirm) return;
    show(`${confirm.action} applied to ${confirm.id}`);
    setConfirm(null);
  }

  return (
    <div className="animate-fade-in grid grid-cols-[260px_1fr] gap-4">
      {/* Permanent filter rail */}
      <aside className="rounded-lg border border-ink-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-700">
            <Filter className="size-3.5" /> FILTERS
          </div>
          <button className="text-[11px] text-brand-600 hover:underline">
            Clear all
          </button>
        </div>

        <FilterGroup label="Search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" />
            <input
              className="h-7 w-full rounded border border-ink-200 bg-white pl-7 pr-2 text-xs outline-none placeholder:text-ink-400 focus:border-brand-500"
              placeholder="Order #, customer…"
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Status">
          {["Pending", "Approved", "Shipped", "Delivered", "Cancelled", "Returned"].map(
            (s) => (
              <label
                key={s}
                className="flex items-center gap-2 py-0.5 text-xs text-ink-700"
              >
                <input type="checkbox" className="size-3 accent-brand-600" /> {s}
              </label>
            )
          )}
        </FilterGroup>

        <FilterGroup label="Date range">
          <div className="flex gap-1">
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute left-1.5 top-1/2 size-3 -translate-y-1/2 text-ink-400" />
              <input
                className="h-7 w-full rounded border border-ink-200 bg-white pl-6 pr-1 text-xs outline-none"
                placeholder="From"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute left-1.5 top-1/2 size-3 -translate-y-1/2 text-ink-400" />
              <input
                className="h-7 w-full rounded border border-ink-200 bg-white pl-6 pr-1 text-xs outline-none"
                placeholder="To"
              />
            </div>
          </div>
        </FilterGroup>

        <FilterGroup label="Customer">
          <select className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs">
            <option>All customers</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Payment">
          {["Paid", "Unpaid", "Partial", "Refunded"].map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 py-0.5 text-xs text-ink-700"
            >
              <input type="checkbox" className="size-3 accent-brand-600" /> {p}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup label="Priority">
          {["Low", "Normal", "High"].map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 py-0.5 text-xs text-ink-700"
            >
              <input type="checkbox" className="size-3 accent-brand-600" /> {p}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup label="Warehouse">
          <select className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs">
            <option>All warehouses</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Sales rep">
          <select className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs">
            <option>All reps</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Amount range">
          <div className="flex gap-1">
            <input
              className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs"
              placeholder="Min"
            />
            <input
              className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs"
              placeholder="Max"
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Tags">
          <input
            className="h-7 w-full rounded border border-ink-200 bg-white px-1.5 text-xs"
            placeholder="wholesale, retail…"
          />
        </FilterGroup>

        <button className="mt-2 h-7 w-full rounded bg-ink-100 text-xs font-medium text-ink-700 hover:bg-ink-200">
          Apply filters
        </button>
      </aside>

      {/* Main */}
      <section className="min-w-0 rounded-lg border border-ink-200 bg-white">
        {/* Toolbar row 1 */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-ink-100 px-3 py-2 text-xs">
          <ToolbarBtn icon={<Plus className="size-3.5" />}>New order</ToolbarBtn>
          <ToolbarBtn icon={<Upload className="size-3.5" />}>Import</ToolbarBtn>
          <ToolbarBtn icon={<Download className="size-3.5" />}>Export</ToolbarBtn>
          <ToolbarBtn icon={<FileSpreadsheet className="size-3.5" />}>
            Export CSV
          </ToolbarBtn>
          <ToolbarBtn icon={<Printer className="size-3.5" />}>Print</ToolbarBtn>
          <ToolbarBtn icon={<Mail className="size-3.5" />}>Email</ToolbarBtn>
          <ToolbarBtn icon={<Share2 className="size-3.5" />}>Share</ToolbarBtn>
          <ToolbarBtn icon={<RefreshCw className="size-3.5" />}>Refresh</ToolbarBtn>
          <ToolbarBtn icon={<Columns3 className="size-3.5" />}>Columns</ToolbarBtn>
          <ToolbarBtn icon={<Settings2 className="size-3.5" />}>Settings</ToolbarBtn>
          <ToolbarBtn icon={<Bell className="size-3.5" />}>Alerts</ToolbarBtn>
          <ToolbarBtn icon={<Archive className="size-3.5" />}>Archive</ToolbarBtn>
          <ToolbarBtn icon={<CircleHelp className="size-3.5" />}>Help</ToolbarBtn>
        </div>

        {/* Toolbar row 2 — bulk actions */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-ink-100 bg-ink-50/60 px-3 py-2 text-xs">
          <span className="text-ink-500">
            Selected: <strong>{selected.size}</strong>
          </span>
          <ToolbarBtn disabled={selected.size === 0}>Approve selected</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Reject selected</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Mark shipped</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Mark delivered</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Add tag</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Assign rep</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Change warehouse</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0}>Duplicate</ToolbarBtn>
          <ToolbarBtn disabled={selected.size === 0} danger>
            Delete
          </ToolbarBtn>
          <div className="ml-auto flex items-center gap-1 text-ink-500">
            <span>Page 1 of 1</span>
            <select className="h-6 rounded border border-ink-200 bg-white px-1 text-[11px]">
              <option>25 / page</option>
              <option>50 / page</option>
              <option>100 / page</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-left text-[11px] uppercase tracking-wide text-ink-500">
                <Th className="w-8">
                  <input type="checkbox" className="size-3 accent-brand-600" />
                </Th>
                <Th sort="id" sortKey={sortKey} sortDir={sortDir} setSort={(k, d) => { setSortKey(k); setSortDir(d); }}>
                  Order #
                </Th>
                <Th sort="customer" sortKey={sortKey} sortDir={sortDir} setSort={(k, d) => { setSortKey(k); setSortDir(d); }}>
                  Customer
                </Th>
                <Th>Ref</Th>
                <Th sort="date" sortKey={sortKey} sortDir={sortDir} setSort={(k, d) => { setSortKey(k); setSortDir(d); }}>
                  Date
                </Th>
                <Th>Items</Th>
                <Th>Warehouse</Th>
                <Th>Sales rep</Th>
                <Th>Payment method</Th>
                <Th>Payment</Th>
                <Th>Priority</Th>
                <Th sort="amount" sortKey={sortKey} sortDir={sortDir} setSort={(k, d) => { setSortKey(k); setSortDir(d); }} className="text-right">
                  Amount
                </Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-ink-100 text-ink-800 hover:bg-ink-50/60"
                >
                  <Td>
                    <input
                      type="checkbox"
                      className="size-3 accent-brand-600"
                      checked={selected.has(o.id)}
                      onChange={() => toggle(o.id)}
                    />
                  </Td>
                  <Td>
                    <span className="font-mono text-[11px] text-ink-900">{o.id}</span>
                  </Td>
                  <Td className="whitespace-nowrap">{o.customer}</Td>
                  <Td className="text-ink-500">{o.customerRef}</Td>
                  <Td>{formatDate(o.date)}</Td>
                  <Td>{o.items}</Td>
                  <Td>{o.warehouse}</Td>
                  <Td>{o.salesRep}</Td>
                  <Td>{o.paymentMethod}</Td>
                  <Td className="capitalize">{o.paymentStatus}</Td>
                  <Td className="capitalize">{o.priority}</Td>
                  <Td className="text-right font-mono">
                    {formatCurrency(o.amount, o.currency)}
                  </Td>
                  <Td>
                    {/* Status is just text — no color, no shape */}
                    <span className="capitalize">{o.status}</span>
                  </Td>
                  <Td>
                    <div className="relative flex items-center justify-end gap-1 text-ink-500">
                      <IconBtn title="View">
                        <Search className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Edit">
                        <Pencil className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Print">
                        <Printer className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Duplicate">
                        <Copy className="size-3.5" />
                      </IconBtn>
                      <IconBtn title="Delete">
                        <Trash2 className="size-3.5" />
                      </IconBtn>
                      <button
                        onClick={() =>
                          setActionsOpen(actionsOpen === o.id ? null : o.id)
                        }
                        className="flex items-center gap-0.5 rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[11px] text-ink-700 hover:bg-ink-50"
                      >
                        Actions <ChevronDown className="size-3" />
                      </button>
                      {actionsOpen === o.id && (
                        <div className="absolute right-0 top-7 z-20 w-40 overflow-hidden rounded-md border border-ink-200 bg-white text-left text-xs shadow-lg">
                          {[
                            "Approve",
                            "Reject",
                            "Mark shipped",
                            "Mark delivered",
                            "Add note",
                            "Assign rep",
                            "Cancel",
                          ].map((a) => (
                            <button
                              key={a}
                              onClick={() => requestAction(o.id, a)}
                              className="block w-full px-2.5 py-1.5 text-left text-ink-700 hover:bg-ink-100"
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-ink-100 px-3 py-2 text-[11px] text-ink-500">
          <span>Showing 12 of 12 records</span>
          <div className="flex items-center gap-2">
            <button className="h-6 rounded border border-ink-200 bg-white px-2 hover:bg-ink-50">
              ← Prev
            </button>
            <button className="h-6 rounded border border-ink-200 bg-white px-2 hover:bg-ink-50">
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Confirm modal (Before always double-confirms) */}
      {confirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/30 p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <h3 className="mb-1 text-sm font-semibold text-ink-900">
              Confirm action
            </h3>
            <p className="mb-4 text-sm text-ink-600">
              Are you sure you want to{" "}
              <strong className="text-ink-900">{confirm.action}</strong> for{" "}
              <span className="font-mono text-ink-800">{confirm.id}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="h-8 rounded border border-ink-200 bg-white px-3 text-sm text-ink-700 hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="h-8 rounded bg-brand-600 px-3 text-sm text-white hover:bg-brand-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToolbarBtn({
  children,
  icon,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded border px-2 text-[11px] font-medium transition-colors",
        disabled
          ? "cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300"
          : danger
          ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
          : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Th({
  children,
  className,
  sort,
  sortKey,
  sortDir,
  setSort,
}: {
  children: React.ReactNode;
  className?: string;
  sort?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  setSort?: (k: string, d: "asc" | "desc") => void;
}) {
  const active = sort && sortKey === sort;
  return (
    <th className={cn("px-2 py-2 font-medium", className)}>
      {sort ? (
        <button
          onClick={() =>
            setSort?.(
              sort,
              active && sortDir === "desc" ? "asc" : "desc"
            )
          }
          className="inline-flex items-center gap-0.5 hover:text-ink-700"
        >
          {children}
          {active &&
            (sortDir === "asc" ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            ))}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-2 py-2", className)}>{children}</td>;
}

function IconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      title={title}
      className="inline-flex size-6 items-center justify-center rounded hover:bg-ink-100 hover:text-ink-700"
    >
      {children}
    </button>
  );
}
