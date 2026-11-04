import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/db/collections";

export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  // Falls back to updatedAt for items that were never opened
  lastUsedAt: Date;
  itemType: { id: string; name: string; icon: string };
  tags: string[];
}

export interface ItemStats {
  items: number;
  favoriteItems: number;
}

const ITEM_SUMMARY_SELECT = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  lastUsedAt: true,
  updatedAt: true,
  itemType: { select: { id: true, name: true, icon: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

const RECENT_FIRST = [
  { lastUsedAt: { sort: "desc", nulls: "last" } },
  { updatedAt: "desc" },
] satisfies Prisma.ItemOrderByWithRelationInput[];

type ItemWithRelations = Prisma.ItemGetPayload<{ select: typeof ITEM_SUMMARY_SELECT }>;

function toItemSummary({ tags, lastUsedAt, updatedAt, ...item }: ItemWithRelations): ItemSummary {
  return { ...item, lastUsedAt: lastUsedAt ?? updatedAt, tags: tags.map((tag) => tag.name) };
}

export async function getPinnedItems(): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL }, isPinned: true },
    orderBy: RECENT_FIRST,
    select: ITEM_SUMMARY_SELECT,
  });
  return items.map(toItemSummary);
}

export async function getRecentItems(limit: number): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: RECENT_FIRST,
    take: limit,
    select: ITEM_SUMMARY_SELECT,
  });
  return items.map(toItemSummary);
}

export async function getItemStats(): Promise<ItemStats> {
  const where = { user: { email: DEMO_USER_EMAIL } };
  const [items, favoriteItems] = await Promise.all([
    prisma.item.count({ where }),
    prisma.item.count({ where: { ...where, isFavorite: true } }),
  ]);
  return { items, favoriteItems };
}
