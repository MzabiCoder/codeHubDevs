import { prisma } from "@/lib/prisma";

// No auth yet, so the dashboard shows the seeded demo user's data
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface CollectionItemType {
  id: string;
  name: string;
  icon: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Ordered by most used first; the first type sets the card color
  itemTypes: CollectionItemType[];
}

export interface CollectionStats {
  collections: number;
  favoriteCollections: number;
}

interface CollectionWithItemTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  items: { item: { itemType: CollectionItemType } }[];
}

function rankItemTypes(items: CollectionWithItemTypes["items"]): CollectionItemType[] {
  const counts = new Map<string, { type: CollectionItemType; count: number }>();
  for (const { item } of items) {
    const entry = counts.get(item.itemType.id);
    if (entry) entry.count++;
    else counts.set(item.itemType.id, { type: item.itemType, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).map(({ type }) => type);
}

function toCollectionSummary({ items, ...collection }: CollectionWithItemTypes): CollectionSummary {
  return { ...collection, itemCount: items.length, itemTypes: rankItemTypes(items) };
}

export async function getRecentCollections(limit: number): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: { item: { select: { itemType: { select: { id: true, name: true, icon: true } } } } },
      },
    },
  });
  return collections.map(toCollectionSummary);
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const where = { user: { email: DEMO_USER_EMAIL } };
  const [collections, favoriteCollections] = await Promise.all([
    prisma.collection.count({ where }),
    prisma.collection.count({ where: { ...where, isFavorite: true } }),
  ]);
  return { collections, favoriteCollections };
}
