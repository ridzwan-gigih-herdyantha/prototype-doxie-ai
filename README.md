# Beacon Commerce — Before → After (Prototype)

One screen (`Orders`) rendered two ways. Same dataset, same operations.
Toggle to compare a deliberately dense legacy ERP layout with a simplified one.

Live message: **Preserve → Simplify.** We don't rebuild the app; we re-present
what the app already does.

## What's in the two views

| Dimension | Before | After |
| --- | --- | --- |
| Columns on first paint | 13 | 7 (rest in side panel) |
| Toolbar buttons visible | 13 primary + 9 bulk | 3 (New / Export / Filters) |
| Filters | Permanent 260px rail, 10 fields | Dropdown + status tabs |
| Status | Plain text column | Colored badge + status tabs |
| Row actions | 5 inline icons + Actions dropdown | 1 primary button + overflow menu |
| Open a record | New modal | Side panel (context preserved) |
| Approve an order | Open menu → Approve → confirm modal (5 clicks) | Inline Approve button (1 click) |

### The 4 annotations in After

1. **Status tabs** replace the status filter.
2. **One primary action per row.** Approve = 1 click (down from 5).
3. **7 columns, not 13.** Secondary data moves into the row sub-line + panel.
4. **Click any row** to open a side panel — no page reload.

## Running locally

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

Keyboard shortcuts on the page:

- `Space` toggles Before ↔ After
- `B` jumps to Before, `A` jumps to After

## Deploying to Vercel

```bash
# first time
npx vercel link
# ship
npx vercel --prod
```

Framework is auto-detected (Next.js). No env vars, no backend — pure static UI
over an in-memory dataset.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS 4
- `lucide-react`, `clsx`, `tailwind-merge`
- UI primitives (Button, Badge, Dropdown, SidePanel, Toast) implemented inline —
  no component library installed, so the whole prototype stays small and
  readable.

## Honest notes

- The "clicks to approve" number is counted against the two flows this
  prototype actually implements. In Before you can also batch-approve via the
  selection toolbar — that costs 3 clicks (checkbox → Approve selected → confirm)
  for a single row and is faster than the per-row Actions menu. The 1-click
  claim in After is for the inline Approve button; via the side panel it's
  2 clicks.
- Fictional brand — "Beacon Commerce" — used so nothing in the demo implies a
  real customer or product.
