"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import { ORDERS, STATUS_LABEL, type Order, type OrderStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PaymentBadge, StatusBadge } from "@/components/ui/badge";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/toast";
import { OrderSidePanel } from "./order-side-panel";

type Tab = "all" | OrderStatus;
const TABS: Tab[] = [
  "all",
  "pending",
  "approved",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

/**
 * Simplified view — same dataset, same operations:
 *  - 7 columns (vs 13)
 *  - 1 primary action, overflow menu for the rest
 *  - status tabs replace the status-filter checkboxes
 *  - filters live in a dropdown
 *  - detail opens in a side panel (no page reload)
 *  - approve = 1 click (vs 5)
 */
export function AfterView() {
  const { show } = useToast();
  const [orders, setOrders] = React.useState<Order[]>(ORDERS);
  const [tab, setTab] = React.useState<Tab>("all");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<Order | null>(null);
  const [showAnnotations, setShowAnnotations] = React.useState(true);

  const counts = React.useMemo(() => {
    const c: Record<Tab, number> = {
      all: orders.length,
      pending: 0,
      approved: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };
    orders.forEach((o) => {
      c[o.status]++;
    });
    return c;
  }, [orders]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => (tab === "all" ? true : o.status === tab))
      .filter(
        (o) =>
          !q ||
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q)
      );
  }, [orders, tab, query]);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    setOpen((o) => (o && o.id === id ? { ...o, status } : o));
  }

  return (
    <div className="animate-fade-in">
      <section className="relative rounded-lg border border-ink-200 bg-white">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-64 rounded-md border border-ink-200 bg-white pl-8 pr-3 text-sm outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="Search orders…"
            />
          </div>

          <Dropdown
            trigger={
              <Button variant="secondary">
                <Filter className="size-3.5" />
                Filters
                <ChevronDown className="size-3.5" />
              </Button>
            }
            align="left"
            menuClassName="w-72 p-3"
          >
            <DropdownLabel>Date range</DropdownLabel>
            <div className="flex gap-1 px-1 pb-2">
              <input
                className="h-7 w-full rounded border border-ink-200 bg-white px-2 text-xs"
                placeholder="From"
              />
              <input
                className="h-7 w-full rounded border border-ink-200 bg-white px-2 text-xs"
                placeholder="To"
              />
            </div>
            <DropdownLabel>Payment</DropdownLabel>
            <div className="flex flex-wrap gap-1 px-1 pb-2">
              {["Paid", "Unpaid", "Partial"].map((p) => (
                <button
                  key={p}
                  className="rounded-full border border-ink-200 bg-white px-2 py-0.5 text-xs text-ink-700 hover:bg-ink-50"
                >
                  {p}
                </button>
              ))}
            </div>
            <DropdownLabel>Priority</DropdownLabel>
            <div className="flex flex-wrap gap-1 px-1 pb-2">
              {["Low", "Normal", "High"].map((p) => (
                <button
                  key={p}
                  className="rounded-full border border-ink-200 bg-white px-2 py-0.5 text-xs text-ink-700 hover:bg-ink-50"
                >
                  {p}
                </button>
              ))}
            </div>
            <DropdownLabel>Warehouse</DropdownLabel>
            <select className="mx-1 mb-2 h-7 w-[calc(100%-0.5rem)] rounded border border-ink-200 bg-white px-2 text-xs">
              <option>All warehouses</option>
            </select>
          </Dropdown>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="size-3.5" />
              Export
            </Button>
            <Button variant="primary">
              <Plus className="size-4" />
              New order
            </Button>
          </div>
        </div>

        {/* Status tabs — replace the Status filter + text column */}
        <div
          id="after-tabs"
          className="flex items-center gap-1 overflow-x-auto border-b border-ink-100 px-2"
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative h-10 whitespace-nowrap px-3 text-sm font-medium transition-colors",
                tab === t
                  ? "text-ink-900"
                  : "text-ink-500 hover:text-ink-700"
              )}
            >
              <span className="flex items-center gap-1.5">
                {t === "all" ? "All" : STATUS_LABEL[t as OrderStatus]}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    tab === t
                      ? "bg-brand-100 text-brand-700"
                      : "bg-ink-100 text-ink-500"
                  )}
                >
                  {counts[t]}
                </span>
              </span>
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-brand-600" />
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div id="after-table" className="scrollbar-thin overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-[11px] uppercase tracking-wide text-ink-500">
                <th className="w-8 px-3 py-2.5">
                  <input type="checkbox" className="size-3.5 accent-brand-600" />
                </th>
                <th className="px-3 py-2.5 font-medium">Order</th>
                <th className="px-3 py-2.5 font-medium">Customer</th>
                <th className="px-3 py-2.5 font-medium">Date</th>
                <th className="px-3 py-2.5 font-medium">Payment</th>
                <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="w-40 px-3 py-2.5 text-right font-medium" id="after-action">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setOpen(o)}
                  className="cursor-pointer border-b border-ink-100 last:border-b-0 hover:bg-ink-50/60"
                >
                  <td
                    className="px-3 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className="size-3.5 accent-brand-600" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-mono text-xs text-ink-500">{o.id}</div>
                    <div className="text-xs text-ink-500">
                      {o.items} items · {o.warehouse}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-ink-900">{o.customer}</div>
                    <div className="text-xs text-ink-500">{o.salesRep}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-ink-700">
                    {formatDate(o.date)}
                  </td>
                  <td className="px-3 py-3">
                    <PaymentBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-ink-900">
                    {formatCurrency(o.amount, o.currency)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td
                    className="px-3 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {o.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            updateStatus(o.id, "approved");
                            show(`${o.id} approved`);
                          }}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setOpen(o)}
                        >
                          View
                        </Button>
                      )}
                      <Dropdown
                        trigger={
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      >
                        <DropdownItem
                          icon={<Mail className="size-3.5" />}
                          onClick={() => show(`Email sent to ${o.email}`)}
                        >
                          Email customer
                        </DropdownItem>
                        <DropdownItem
                          icon={<Printer className="size-3.5" />}
                          onClick={() => show("Opening print view…")}
                        >
                          Print
                        </DropdownItem>
                        <DropdownItem
                          icon={<Copy className="size-3.5" />}
                          onClick={() => show("Order duplicated")}
                        >
                          Duplicate
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          icon={<XCircle className="size-3.5" />}
                          danger
                          onClick={() => {
                            updateStatus(o.id, "cancelled");
                            show(`${o.id} cancelled`);
                          }}
                        >
                          Cancel order
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="px-3 py-10 text-center text-sm text-ink-500">
              No orders match this view.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 px-4 py-2.5 text-xs text-ink-500">
          <span>
            Showing <strong className="text-ink-700">{visible.length}</strong> of{" "}
            {orders.length}
          </span>
          <button
            onClick={() => setShowAnnotations((s) => !s)}
            className="rounded-md border border-ink-200 bg-white px-2 py-1 text-[11px] font-medium text-ink-600 hover:bg-ink-50"
          >
            {showAnnotations ? "Hide" : "Show"} design notes
          </button>
        </div>

        {/* Floating annotations */}
        {showAnnotations && <Annotations />}
      </section>

      <OrderSidePanel
        order={open}
        onClose={() => setOpen(null)}
        onStatusChange={updateStatus}
      />
    </div>
  );
}

function Annotations() {
  return (
    <>
      <Note
        className="left-2 -top-3 sm:-left-3 sm:top-6"
        arrow="right"
      >
        <strong>Status tabs</strong> replace the always-open status filter — scan
        the queue at a glance.
      </Note>
      <Note
        className="hidden md:block right-4 top-28"
        arrow="left"
      >
        <strong>One primary action per row.</strong> Approving a pending order is
        now <em>1 click</em> instead of 5.
      </Note>
      <Note
        className="hidden md:block left-6 bottom-16"
        arrow="right"
      >
        <strong>7 columns, not 13.</strong> Secondary data moves into the row&apos;s
        sub-line and the side panel.
      </Note>
      <Note
        className="hidden lg:block right-6 -bottom-6"
        arrow="up"
      >
        <strong>Click any row</strong> to open details in a side panel — no page
        reload, context stays.
      </Note>
    </>
  );
}

function Note({
  children,
  className,
  arrow,
}: {
  children: React.ReactNode;
  className?: string;
  arrow?: "left" | "right" | "up" | "down";
}) {
  return (
    <div
      className={cn(
        "absolute z-10 max-w-[220px] rounded-md bg-amber-100 px-3 py-2 text-[11px] leading-snug text-amber-900 shadow-md ring-1 ring-amber-200",
        className
      )}
    >
      <span
        className={cn(
          "absolute block size-2 rotate-45 bg-amber-100 ring-1 ring-amber-200",
          arrow === "right" && "right-[-5px] top-4",
          arrow === "left" && "left-[-5px] top-4",
          arrow === "up" && "-top-1 left-6",
          arrow === "down" && "-bottom-1 left-6"
        )}
      />
      {children}
    </div>
  );
}
