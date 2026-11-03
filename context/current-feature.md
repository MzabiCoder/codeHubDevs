#  Current Feature

<!-- Feature name and short description-->

Database Setup: Prisma 7 ORM with Neon PostgreSQL (serverless). Full spec in `context/features/database-spec.md`.

## Status 

<!-- Not Started | In Progress | Completed-->

Completed

## Goals 

<!-- Goals and requirements -->

- Install and configure Prisma 7 with Neon PostgreSQL (serverless)
- Create the initial schema from the data models in `context/project-overview.md.md` (User, ItemType, Item, Collection, ItemCollection, Tag); this will evolve
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create the initial migration with `prisma migrate dev` against the development branch

## Notes 

<!-- Any extra notes -->

- Use Prisma 7, which has breaking changes: `prisma-client` generator with required `output`, connection settings in `prisma.config.ts`, driver adapters. Read the upgrade guide before starting: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- `DATABASE_URL` points to the Neon development branch; a separate production branch will exist
- ALWAYS create migrations. Never use `prisma db push` unless explicitly specified
- Run `prisma migrate status` before committing to verify migrations are in sync

## History

<!-- Keep this updated. Earliest to latest -->

- Initial setup: Next.js 16, React 19, TypeScript and Tailwind CSS v4
- Mock data: current user, item types, collections and items in `src/lib/mock-data.ts`
- Dashboard UI Phase 1: ShadCN setup, /dashboard layout with dark mode, top bar (search + new item) and sidebar/main placeholders
- Dashboard UI Phase 2: collapsible sidebar (icon mode on desktop, drawer on mobile) with item types linking to /items/TYPE, favorite and recent collections, user avatar area and top bar toggle
- Dashboard UI Phase 3: main dashboard area with 4 stats cards, recent collections grid, pinned items and 10 recent items
- Database Setup: Prisma 7 with Neon PostgreSQL (Neon serverless adapter, `prisma.config.ts`), initial schema with Auth.js models, indexes and cascade deletes, `init` migration applied to the dev branch, and `scripts/test-db.ts` connection check
