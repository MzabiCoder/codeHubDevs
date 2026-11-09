import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/db/demo-user";

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

const COLLECTION_SELECT = {
  id: true,
  name: true,
  description: true,
  isFavorite: true,
  _count: { select: { items: true } },
} satisfies Prisma.CollectionSelect;

type CollectionRow = Prisma.CollectionGetPayload<{ select: typeof COLLECTION_SELECT }>;

// Item type usage per collection, most used first
async function getRankedTypeIds(collectionIds: string[]): Promise<Map<string, string[]>> {
  const links = await prisma.itemCollection.findMany({
    where: { collectionId: { in: collectionIds } },
    select: { collectionId: true, item: { select: { itemTypeId: true } } },
  });

  const counts = new Map<string, Map<string, number>>();
  for (const { collectionId, item } of links) {
    const typeCounts = counts.get(collectionId) ?? new Map<string, number>();
    typeCounts.set(item.itemTypeId, (typeCounts.get(item.itemTypeId) ?? 0) + 1);
    counts.set(collectionId, typeCounts);
  }

  const ranked = new Map<string, string[]>();
  for (const [collectionId, typeCounts] of counts) {
    const typeIds = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    ranked.set(collectionId, typeIds);
  }
  return ranked;
}

async function toCollectionSummaries(collections: CollectionRow[]): Promise<CollectionSummary[]> {
  if (collections.length === 0) return [];

  const rankedTypeIds = await getRankedTypeIds(collections.map((c) => c.id));
  const typeIds = [...new Set([...rankedTypeIds.values()].flat())];
  const types = await prisma.itemType.findMany({
    where: { id: { in: typeIds } },
    select: { id: true, name: true, icon: true },
  });
  const typesById = new Map(types.map((type) => [type.id, type]));

  return collections.map(({ _count, ...collection }) => ({
    ...collection,
    itemCount: _count.items,
    itemTypes: (rankedTypeIds.get(collection.id) ?? []).flatMap((id) => typesById.get(id) ?? []),
  }));
}

export async function getRecentCollections(
  limit: number,
  { excludeFavorites = false } = {},
): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: {
      user: { email: DEMO_USER_EMAIL },
      ...(excludeFavorites && { isFavorite: false }),
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: COLLECTION_SELECT,
  });
  return toCollectionSummaries(collections);
}

export async function getFavoriteCollections(): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER_EMAIL }, isFavorite: true },
    orderBy: { name: "asc" },
    select: COLLECTION_SELECT,
  });
  return toCollectionSummaries(collections);
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const where = { user: { email: DEMO_USER_EMAIL } };
  const [collections, favoriteCollections] = await Promise.all([
    prisma.collection.count({ where }),
    prisma.collection.count({ where: { ...where, isFavorite: true } }),
  ]);
  return { collections, favoriteCollections };
}
