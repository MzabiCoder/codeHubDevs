import { collections, items, type Collection } from "@/lib/mock-data";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

function getCollectionLastUsedAt(collectionId: string): number {
  return items
    .filter((item) => item.collectionIds.includes(collectionId))
    .reduce((latest, item) => Math.max(latest, Date.parse(item.lastUsedAt)), 0);
}

export function getRecentCollections(
  limit: number,
  { excludeFavorites = false } = {},
): Collection[] {
  return collections
    .filter((collection) => !excludeFavorites || !collection.isFavorite)
    .sort((a, b) => getCollectionLastUsedAt(b.id) - getCollectionLastUsedAt(a.id))
    .slice(0, limit);
}
