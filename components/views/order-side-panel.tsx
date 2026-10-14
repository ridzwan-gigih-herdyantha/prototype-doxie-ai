"use client";

import * as React from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Printer,
  X,
  XCircle,
} from "lucide-react";
import type { Order } from "@/lib/data";
import { SidePanel } from "@/components/ui/side-panel";
import { Button } from "@/components/ui/button";
import { PaymentBadge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/toast";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";

export function OrderSidePanel({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Order["status"]) => void;
}) {
  const { show } = useToast();

  if (!order) return null;

  const canApprove = order.status === "pending";

  return (
    <SidePanel open={!!order} onClose={onClose}>
      <header className="sticky top-0 z-10 border-b border-ink-100 bg-white px-5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ink-500">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <h2 className="truncate text-base font-semibold text-ink-900">
              {order.customer}
            </h2>
            <p className="text-xs text-ink-500">
              {order.customerRef} · {order.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-500 hover:bg-ink-100"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Primary + secondary actions — ONE prominent action */}
        <div className="mt-3 flex items-center gap-2">
          {canApprove ? (
            <Button
              variant="primary"
              onClick={() => {
                onStatusChange(order.id, "approved");
                show(`${order.id} approved`);
              }}
            >
              <Check className="size-4" />
              Approve order
            </Button>
          ) : (
            <Button variant="primary" disabled>
              <Check className="size-4" />
              Approve order
            </Button>
          )}

          <Dropdown
            trigger={
              <Button variant="secondary">
                More actions
              </Button>
            }
            align="left"
          >
            <DropdownItem icon={<XCircle className="size-3.5" />}
              onClick={() => {
                onStatusChange(order.id, "cancelled");
                show(`${order.id} rejected`);
              }}
            >
              Reject
            </DropdownItem>
            <DropdownItem icon={<Mail className="size-3.5" />}
              onClick={() => show(`Email sent to ${order.email}`)}
            >
              Email customer
            </DropdownItem>
            <DropdownItem icon={<Printer className="size-3.5" />}
              onClick={() => show("Opening print view…")}
            >
              Print
            </DropdownItem>
            <DropdownItem icon={<Copy className="size-3.5" />}
              onClick={() => show("Order duplicated")}
            >
              Duplicate
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<ArrowUpRight className="size-3.5" />}
              onClick={() => show("Opening full page…")}
            >
              Open full page
            </DropdownItem>
          </Dropdown>
        </div>
      </header>

      <div className="px-5 py-4">
        <section className="mb-5 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
          <Field label="Order date">{formatDate(order.date)}</Field>
          <Field label="Amount">
            <span className="font-mono text-ink-900">
              {formatCurrency(order.amount, order.currency)}
            </span>
          </Field>
          <Field label="Payment">
            <PaymentBadge status={order.paymentStatus} />
            <span className="ml-2 text-xs text-ink-500">
              {order.paymentMethod}
            </span>
          </Field>
          <Field label="Priority">
            <PriorityBadge priority={order.priority} />
          </Field>
          <Field label="Warehouse">{order.warehouse}</Field>
          <Field label="Sales rep">{order.salesRep}</Field>
        </section>

        {order.notes && (
          <section className="mb-5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
            <strong className="font-medium">Note: </strong>
            {order.notes}
          </section>
        )}

        <section className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-500">
          Line items ({order.items})
        </section>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-500">
              <th className="py-2 pr-2 font-medium">SKU</th>
              <th className="py-2 pr-2 font-medium">Item</th>
              <th className="py-2 pr-2 text-right font-medium">Qty</th>
              <th className="py-2 pr-0 text-right font-medium">Unit</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.sku} className="border-t border-ink-100">
                <td className="py-2 pr-2 font-mono text-[11px] text-ink-500">
                  {l.sku}
                </td>
                <td className="py-2 pr-2">{l.name}</td>
                <td className="py-2 pr-2 text-right">{l.qty}</td>
                <td className="py-2 pr-0 text-right font-mono text-xs">
                  {formatCurrency(l.unit, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink-200">
              <td colSpan={3} className="py-2 pr-2 text-right text-xs text-ink-500">
                Total
              </td>
              <td className="py-2 pr-0 text-right font-mono text-sm font-medium">
                {formatCurrency(order.amount, order.currency)}
              </td>
            </tr>
          </tfoot>
        </table>

        {order.tags.length > 0 && (
          <section className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-500">Tags:</span>
            {order.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] text-ink-700"
              >
                {t}
              </span>
            ))}
          </section>
        )}
      </div>
    </SidePanel>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <div className="mt-0.5 text-ink-800">{children}</div>
    </div>
  );
}
