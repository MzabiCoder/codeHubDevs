import {
  collections,
  items,
  itemTypes,
  type Collection,
  type Item,
  type ItemType,
} from "@/lib/mock-data";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export function getItemType(itemTypeId: string): ItemType | undefined {
  return itemTypes.find((type) => type.id === itemTypeId);
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

function byLastUsedDesc(a: Item, b: Item): number {
  return Date.parse(b.lastUsedAt) - Date.parse(a.lastUsedAt);
}

export function getPinnedItems(): Item[] {
  return items.filter((item) => item.isPinned).sort(byLastUsedDesc);
}

export function getRecentItems(limit: number): Item[] {
  return [...items].sort(byLastUsedDesc).slice(0, limit);
}

export function getDashboardStats(): DashboardStats {
  return {
    items: items.length,
    collections: collections.length,
    favoriteItems: items.filter((item) => item.isFavorite).length,
    favoriteCollections: collections.filter((collection) => collection.isFavorite).length,
  };
}
