#  Current Feature

<!-- Feature name and short description-->

Mock data: a single source of truth for the dashboard UI until the database is implemented.

## Status 

<!-- Not Started | In Progress | Completed-->

In Progress

## Goals 

<!-- Goals and requirements -->

- Create `src/lib/mock-data.ts` with the current user, item types, collections and items
- Match the data shown in `dashboard-ui-main.png`
- Plain data only, no helper methods

## Notes 

<!-- Any extra notes -->

- Item counts are stored as values because the mock items are only a sample of what the counts describe

## History

<!-- Keep this updated. Earliest to latest -->

- Initial setup: Next.js 16, React 19, TypeScript and Tailwind CSS v4
- Mock data: current user, item types, collections and items in `src/lib/mock-data.ts`