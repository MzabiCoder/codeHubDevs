import { Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getItemType } from "@/lib/dashboard";
import { getItemTypeStyle } from "@/lib/item-type-styles";
import type { Item } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const style = getItemTypeStyle(getItemType(item.itemTypeId)?.icon);
  const Icon = style.icon;

  return (
    <Card className={cn("flex-row items-start gap-4 border-l-2 px-5", style.borderClassName)}>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          style.bgClassName,
        )}
      >
        <Icon className={cn("size-5", style.className)} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{item.title}</h3>
          {item.isPinned && (
            <Pin className="size-3.5 shrink-0 text-muted-foreground" aria-label="Pinned" />
          )}
          {item.isFavorite && (
            <Star
              className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
              aria-label="Favorite"
            />
          )}
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{item.description}</p>
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <time
        dateTime={item.lastUsedAt}
        className="shrink-0 text-xs text-muted-foreground"
      >
        {DATE_FORMAT.format(new Date(item.lastUsedAt))}
      </time>
    </Card>
  );
}
