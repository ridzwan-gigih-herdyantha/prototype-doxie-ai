import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus, Priority } from "@/lib/data";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  approved: "bg-blue-100 text-blue-800 ring-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-ink-100 text-ink-600 ring-ink-200",
  returned: "bg-rose-100 text-rose-800 ring-rose-200",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  refunded: "bg-ink-100 text-ink-600 ring-ink-200",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-ink-100 text-ink-600 ring-ink-200",
  normal: "bg-blue-50 text-blue-700 ring-blue-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status]
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "pending" && "bg-amber-500",
          status === "approved" && "bg-blue-500",
          status === "shipped" && "bg-indigo-500",
          status === "delivered" && "bg-emerald-500",
          status === "cancelled" && "bg-ink-400",
          status === "returned" && "bg-rose-500"
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        PAYMENT_STYLES[status]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        PRIORITY_STYLES[priority]
      )}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
