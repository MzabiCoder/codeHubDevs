#  Current Feature

Add a PRO badge to the Files and Images item types in the sidebar. Full spec in `context/features/add-pro-badge-side.md`.

## Status 

Completed

## Goals 

- Show a "PRO" badge next to the Files and Images item types in the sidebar
- Use the shadcn/ui `Badge` component
- Keep the badge clean and subtle
- Badge text is all uppercase: `PRO`

## Notes 

- Only the Files and Images types get the badge; other types stay unchanged
- Spec: `context/features/add-pro-badge-side.md`

## History

- Initial setup: Next.js 16, React 19, TypeScript and Tailwind CSS v4
- Mock data: current user, item types, collections and items in `src/lib/mock-data.ts`
- Dashboard UI Phase 1: ShadCN setup, /dashboard layout with dark mode, top bar (search + new item) and sidebar/main placeholders
- Dashboard UI Phase 2: collapsible sidebar (icon mode on desktop, drawer on mobile) with item types linking to /items/TYPE, favorite and recent collections, user avatar area and top bar toggle
- Dashboard UI Phase 3: main dashboard area with 4 stats cards, recent collections grid, pinned items and 10 recent items
- Database Setup: Prisma 7 with Neon PostgreSQL (Neon serverless adapter, `prisma.config.ts`), initial schema with Auth.js models, indexes and cascade deletes, `init` migration applied to the dev branch, and `scripts/test-db.ts` connection check
- Seed Data: `prisma/seed.ts` (run with `npm run db:seed`) with the demo user, 7 system item types, 5 collections and 18 items, safe to re-run; `scripts/test-db.ts` now displays the demo data
- Dashboard Collections: recent collections and collection stats on the dashboard come from the database via `src/lib/db/collections.ts` (demo user until auth), with card border color from the most-used item type, type icons per collection, and a `loading.tsx` skeleton for the request-time render
- Dashboard Items: pinned items, the 10 most recent items and item stats on the dashboard come from the database via `src/lib/db/items.ts` (demo user until auth), with card icon and border from the item type, tags as badges, and the pinned section hidden when empty
- Stats & Sidebar: sidebar item types (fixed order, icons, per-type counts, links to /items/[slug]) and favorite/recent collections come from the database via `src/lib/db/items.ts` and `src/lib/db/collections.ts`, with a colored circle per recent collection from its most-used item type, a "View all collections" link, and skeleton fallbacks while the sidebar streams
- Pro Badge Sidebar: subtle outline shadcn `Badge` with uppercase "PRO" next to the Files and Images item types in the sidebar, hidden in collapsed icon mode
