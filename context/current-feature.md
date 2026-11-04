#  Current Feature

<!-- Feature name and short description-->

Dashboard Collections: replace the mock recent collections in the dashboard main area with real data from the Neon database via Prisma. Full spec in `context/features/dashboard-collections-spec.md`.

## Status 

<!-- Not Started | In Progress | Completed-->

Completed

## Goals 

<!-- Goals and requirements -->

- Create `src/lib/db/collections.ts` with the data fetching functions
- Fetch collections directly in the server component instead of using `src/lib/mock-data.ts`
- Keep the current design: the grid of 6 recent collection cards (see `context/screenshots/dashboard-ui-main.png`)
- Derive each collection card's border color from the most-used content type in that collection
- Show small icons for all item types in each collection
- Update the collection stats display to use real data

## Notes 

<!-- Any extra notes -->

- Do not add the items underneath the collections yet. That comes in a later feature

## History

<!-- Keep this updated. Earliest to latest -->

- Initial setup: Next.js 16, React 19, TypeScript and Tailwind CSS v4
- Mock data: current user, item types, collections and items in `src/lib/mock-data.ts`
- Dashboard UI Phase 1: ShadCN setup, /dashboard layout with dark mode, top bar (search + new item) and sidebar/main placeholders
- Dashboard UI Phase 2: collapsible sidebar (icon mode on desktop, drawer on mobile) with item types linking to /items/TYPE, favorite and recent collections, user avatar area and top bar toggle
- Dashboard UI Phase 3: main dashboard area with 4 stats cards, recent collections grid, pinned items and 10 recent items
- Database Setup: Prisma 7 with Neon PostgreSQL (Neon serverless adapter, `prisma.config.ts`), initial schema with Auth.js models, indexes and cascade deletes, `init` migration applied to the dev branch, and `scripts/test-db.ts` connection check
- Seed Data: `prisma/seed.ts` (run with `npm run db:seed`) with the demo user, 7 system item types, 5 collections and 18 items, safe to re-run; `scripts/test-db.ts` now displays the demo data
- Dashboard Collections: recent collections and collection stats on the dashboard come from the database via `src/lib/db/collections.ts` (demo user until auth), with card border color from the most-used item type, type icons per collection, and a `loading.tsx` skeleton for the request-time render
