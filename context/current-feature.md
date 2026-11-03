#  Current Feature

<!-- Feature name and short description-->

Seed Data: a seed script (`prisma/seed.ts`) that fills the database with sample data for development and demos. Full spec in `context/features/seed-spec.md`.

## Status 

<!-- Not Started | In Progress | Completed-->

Completed

## Goals 

<!-- Goals and requirements -->

- Create `prisma/seed.ts` and register it as the seed command in `prisma.config.ts`
- Demo user: `demo@devstash.io`, name "Demo User", password `12345678` hashed with bcryptjs (12 rounds), `isPro: false`, `emailVerified` set to the current date
- 7 system item types (`isSystem: true`, no user):

  | Name    | Icon       | Color   |
  | ------- | ---------- | ------- |
  | snippet | Code       | #3b82f6 |
  | prompt  | Sparkles   | #8b5cf6 |
  | command | Terminal   | #f97316 |
  | note    | StickyNote | #fde047 |
  | file    | File       | #6b7280 |
  | image   | Image      | #ec4899 |
  | link    | Link       | #10b981 |

- 5 collections owned by the demo user, with their items:
  - **React Patterns** (Reusable React patterns and hooks): 3 TypeScript snippets covering custom hooks (useDebounce, useLocalStorage), component patterns (context providers, compound components) and utility functions
  - **AI Workflows** (AI prompts and workflow automations): 3 prompts for code review, documentation generation and refactoring assistance
  - **DevOps** (Infrastructure and deployment resources): 1 snippet (Docker / CI/CD config), 1 command (deployment script) and 2 links to real documentation URLs
  - **Terminal Commands** (Useful shell commands for everyday development): 4 commands for Git, Docker, process management and package manager utilities
  - **Design Resources** (UI/UX resources and references): 4 links to real URLs for CSS/Tailwind references, component libraries, design systems and icon libraries

## Notes 

<!-- Any extra notes -->

- Prisma 7 does not run the seed during `migrate dev` or `migrate reset`. Run it explicitly with `npx prisma db seed`
- Run the seed with `tsx` and load env variables with `dotenv`
- Use the slugs and content types from the seed table in `context/project-overview.md.md` (`snippets`, `prompts`, `links`, etc.)
- Make the seed safe to re-run. Postgres treats `NULL` user IDs as distinct in `@@unique([userId, slug])`, so look system types up by slug where `userId` is null instead of using `upsert`
- Seeding inserts data only. It must not change the schema or need a migration

## History

<!-- Keep this updated. Earliest to latest -->

- Initial setup: Next.js 16, React 19, TypeScript and Tailwind CSS v4
- Mock data: current user, item types, collections and items in `src/lib/mock-data.ts`
- Dashboard UI Phase 1: ShadCN setup, /dashboard layout with dark mode, top bar (search + new item) and sidebar/main placeholders
- Dashboard UI Phase 2: collapsible sidebar (icon mode on desktop, drawer on mobile) with item types linking to /items/TYPE, favorite and recent collections, user avatar area and top bar toggle
- Dashboard UI Phase 3: main dashboard area with 4 stats cards, recent collections grid, pinned items and 10 recent items
- Database Setup: Prisma 7 with Neon PostgreSQL (Neon serverless adapter, `prisma.config.ts`), initial schema with Auth.js models, indexes and cascade deletes, `init` migration applied to the dev branch, and `scripts/test-db.ts` connection check
- Seed Data: `prisma/seed.ts` (run with `npm run db:seed`) with the demo user, 7 system item types, 5 collections and 18 items, safe to re-run; `scripts/test-db.ts` now displays the demo data
