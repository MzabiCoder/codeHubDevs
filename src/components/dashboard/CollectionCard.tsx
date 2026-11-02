import Link from "next/link";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getItemType } from "@/lib/dashboard";
import { getItemTypeStyle } from "@/lib/item-type-styles";
import type { Collection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const accent = getItemTypeStyle(getItemType(collection.itemTypeIds[0])?.icon);

  return (
    <Link href={`/collections/${collection.id}`} className="rounded-xl">
      <Card
        className={cn(
          "h-full gap-0 border-l-2 px-5 py-5 transition-colors hover:bg-accent/40",
          accent.borderClassName,
        )}
      >
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {collection.itemCount} items
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {collection.description}
        </p>
        <div className="mt-3 flex gap-2">
          {collection.itemTypeIds.map((typeId) => {
            const type = getItemType(typeId);
            const { icon: Icon, className } = getItemTypeStyle(type?.icon);
            return (
              <Icon key={typeId} className={cn("size-4", className)} aria-label={type?.name} />
            );
          })}
        </div>
      </Card>
    </Link>
  );
}
