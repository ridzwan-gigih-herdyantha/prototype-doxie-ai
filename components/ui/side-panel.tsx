"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SidePanel({
  open,
  onClose,
  children,
  widthClass = "w-full sm:w-[460px]",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink-900/20 animate-fade-in"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full overflow-y-auto border-l border-ink-200 bg-white shadow-xl animate-slide-in-right",
          widthClass
        )}
      >
        {children}
      </aside>
    </>
  );
}
