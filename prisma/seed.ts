import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { ContentType } from "@/generated/prisma/client";

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

const SYSTEM_TYPES: { name: string; slug: string; icon: string; color: string; contentType: ContentType }[] = [
  { name: "snippet", slug: "snippets", icon: "Code", color: "#3b82f6", contentType: "TEXT" },
  { name: "prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6", contentType: "TEXT" },
  { name: "command", slug: "commands", icon: "Terminal", color: "#f97316", contentType: "TEXT" },
  { name: "note", slug: "notes", icon: "StickyNote", color: "#fde047", contentType: "TEXT" },
  { name: "file", slug: "files", icon: "File", color: "#6b7280", contentType: "FILE" },
  { name: "image", slug: "images", icon: "Image", color: "#ec4899", contentType: "FILE" },
  { name: "link", slug: "links", icon: "Link", color: "#10b981", contentType: "URL" },
];

interface SeedItem {
  type: string; // system type slug
  title: string;
  description: string;
  content?: string;
  url?: string;
  language?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
}

interface SeedCollection {
  name: string;
  description: string;
  defaultType: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    defaultType: "snippets",
    isFavorite: true,
    items: [
      {
        type: "snippets",
        title: "useDebounce and useLocalStorage hooks",
        description: "Debounce a changing value and persist state to localStorage",
        language: "typescript",
        isPinned: true,
        isFavorite: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "snippets",
        title: "Context provider and compound components",
        description: "Typed context with a safe hook, used to build a compound Tabs component",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        type: "snippets",
        title: "Utility functions",
        description: "Class name merging, async sleep and array grouping helpers",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function groupBy<T, K extends PropertyKey>(items: T[], getKey: (item: T) => K) {
  return items.reduce(
    (groups, item) => {
      const key = getKey(item);
      (groups[key] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    defaultType: "prompts",
    isFavorite: true,
    items: [
      {
        type: "prompts",
        title: "Code review prompt",
        description: "Thorough review focused on bugs, security and readability",
        isPinned: true,
        content: `You are a senior engineer reviewing a pull request.

Review the code below and report, in order of severity:
1. Bugs and logic errors, with the input that triggers each one
2. Security issues (auth checks, input validation, injection, secrets)
3. Performance problems (N+1 queries, unnecessary re-renders, heavy loops)
4. Readability and naming

For each finding, quote the line, explain the problem and suggest a fix.
Skip style nitpicks that a linter would catch.

Code:
{{code}}`,
      },
      {
        type: "prompts",
        title: "Documentation generator",
        description: "Generate README-style docs for a module or function",
        content: `Write documentation for the following code.

Include:
- A one-paragraph summary of what it does and when to use it
- Parameters and return values, with types
- One realistic usage example
- Edge cases and errors the caller should handle

Write for a developer who is new to this codebase. Use Markdown.

Code:
{{code}}`,
      },
      {
        type: "prompts",
        title: "Refactoring assistant",
        description: "Refactor code for clarity without changing behavior",
        isFavorite: true,
        content: `Refactor the code below to make it easier to read and maintain.

Rules:
- Do not change its behavior or public API
- Prefer small, well-named functions over comments
- Remove duplication and dead code
- Keep the existing code style and libraries

First list the changes you plan to make and why, then show the refactored code.

Code:
{{code}}`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    defaultType: "snippets",
    items: [
      {
        type: "snippets",
        title: "Next.js Dockerfile",
        description: "Multi-stage Docker build for a standalone Next.js app",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "commands",
        title: "Deploy with migrations",
        description: "Apply pending Prisma migrations, then build and start the app",
        language: "bash",
        content: `npm ci && npx prisma migrate deploy && npm run build && npm run start`,
      },
      {
        type: "links",
        title: "Docker documentation",
        description: "Official Docker docs: Dockerfiles, Compose and builds",
        url: "https://docs.docker.com/",
      },
      {
        type: "links",
        title: "GitHub Actions documentation",
        description: "Workflows, runners and CI/CD with GitHub Actions",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    defaultType: "commands",
    items: [
      {
        type: "commands",
        title: "Undo the last commit but keep changes",
        description: "Move HEAD back one commit and leave the changes staged",
        language: "bash",
        isPinned: true,
        content: `git reset --soft HEAD~1`,
      },
      {
        type: "commands",
        title: "Clean up Docker",
        description: "Remove stopped containers, unused images, networks and build cache",
        language: "bash",
        content: `docker system prune -a --volumes`,
      },
      {
        type: "commands",
        title: "Kill the process on a port",
        description: "Find and stop whatever is listening on port 3000",
        language: "bash",
        content: `lsof -ti tcp:3000 | xargs kill -9`,
      },
      {
        type: "commands",
        title: "Check for outdated packages",
        description: "List outdated npm dependencies and update within semver ranges",
        language: "bash",
        content: `npm outdated && npm update`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    defaultType: "links",
    items: [
      {
        type: "links",
        title: "Tailwind CSS docs",
        description: "Utility classes, theming and Tailwind v4 configuration",
        url: "https://tailwindcss.com/docs",
        isFavorite: true,
      },
      {
        type: "links",
        title: "shadcn/ui",
        description: "Accessible components built on Radix UI and Tailwind",
        url: "https://ui.shadcn.com/",
      },
      {
        type: "links",
        title: "Material Design 3",
        description: "Google's open-source design system and guidelines",
        url: "https://m3.material.io/",
      },
      {
        type: "links",
        title: "Lucide icons",
        description: "Open-source icon library used across DevStash",
        url: "https://lucide.dev/icons/",
      },
    ],
  },
];

// System types have no user, and Postgres treats NULLs as distinct in
// @@unique([userId, slug]), so they are matched by slug instead of upserted.
async function seedSystemTypes() {
  const typeIds = new Map<string, string>();

  for (const type of SYSTEM_TYPES) {
    const existing = await prisma.itemType.findFirst({ where: { slug: type.slug, userId: null } });
    const saved = existing
      ? await prisma.itemType.update({ where: { id: existing.id }, data: { ...type, isSystem: true } })
      : await prisma.itemType.create({ data: { ...type, isSystem: true } });
    typeIds.set(type.slug, saved.id);
  }

  return typeIds;
}

async function seedDemoUser() {
  const password = await bcrypt.hash(DEMO_USER.password, 12);
  const data = { name: DEMO_USER.name, password, isPro: false, emailVerified: new Date() };

  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: data,
    create: { email: DEMO_USER.email, ...data },
  });
}

async function seedCollections(userId: string, typeIds: Map<string, string>) {
  // Start from a clean slate so re-running the seed doesn't duplicate data
  await prisma.item.deleteMany({ where: { userId } });
  await prisma.collection.deleteMany({ where: { userId } });

  for (const collection of COLLECTIONS) {
    const { id: collectionId } = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        defaultTypeId: typeIds.get(collection.defaultType),
        userId,
      },
    });

    for (const { type, ...item } of collection.items) {
      const systemType = SYSTEM_TYPES.find((t) => t.slug === type)!;
      await prisma.item.create({
        data: {
          ...item,
          contentType: systemType.contentType,
          lastUsedAt: new Date(),
          userId,
          itemTypeId: typeIds.get(type)!,
          collections: { create: { collectionId } },
        },
      });
    }
  }
}

async function main() {
  const typeIds = await seedSystemTypes();
  const user = await seedDemoUser();
  await seedCollections(user.id, typeIds);

  const itemCount = COLLECTIONS.reduce((total, c) => total + c.items.length, 0);
  console.log(`Seeded ${typeIds.size} system types, ${COLLECTIONS.length} collections and ${itemCount} items for ${user.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
