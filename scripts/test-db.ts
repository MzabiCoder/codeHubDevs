import "dotenv/config";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@devstash.io";

async function showConnection() {
  const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`;
  console.log("Connected:", version.split(",")[0]);

  const migrations = await prisma.$queryRaw<{ migration_name: string }[]>`
    SELECT migration_name FROM _prisma_migrations
    WHERE finished_at IS NOT NULL
    ORDER BY finished_at`;
  console.log("Applied migrations:", migrations.map((m) => m.migration_name).join(", ") || "none");

  const counts = {
    users: await prisma.user.count(),
    itemTypes: await prisma.itemType.count(),
    items: await prisma.item.count(),
    collections: await prisma.collection.count(),
    tags: await prisma.tag.count(),
  };
  console.table(counts);
}

async function showSystemTypes() {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: { name: true, slug: true, icon: true, color: true, contentType: true, _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });

  console.log("\nSystem item types:");
  console.table(types.map(({ _count, ...type }) => ({ ...type, items: _count.items })));
}

async function showDemoUser() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      collections: {
        orderBy: { createdAt: "asc" },
        include: {
          defaultType: { select: { name: true } },
          items: { include: { item: { include: { itemType: { select: { name: true } } } } } },
        },
      },
    },
  });

  if (!user) {
    console.log(`\nDemo user ${DEMO_EMAIL} not found. Run \`npm run db:seed\` first.`);
    return;
  }

  console.log(`\nDemo user: ${user.name} <${user.email}> | pro: ${user.isPro} | verified: ${Boolean(user.emailVerified)}`);

  for (const collection of user.collections) {
    const favorite = collection.isFavorite ? " ★" : "";
    console.log(`\n${collection.name}${favorite} (${collection.items.length} items, default: ${collection.defaultType?.name ?? "none"})`);
    console.log(`  ${collection.description}`);

    for (const { item } of collection.items) {
      const flags = [item.isPinned && "pinned", item.isFavorite && "favorite"].filter(Boolean).join(", ");
      const detail = item.url ?? item.language ?? "";
      console.log(`  - [${item.itemType.name}] ${item.title}${detail ? ` (${detail})` : ""}${flags ? ` [${flags}]` : ""}`);
    }
  }
}

async function main() {
  await showConnection();
  await showSystemTypes();
  await showDemoUser();
}

main()
  .catch((error) => {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
