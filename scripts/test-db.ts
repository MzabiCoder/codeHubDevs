import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
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

main()
  .catch((error) => {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
