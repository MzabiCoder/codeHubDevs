import { FolderOpen, Layers, type LucideIcon, Star, Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: Stat[] = [
    { label: "Items", value: stats.items, icon: Layers },
    { label: "Collections", value: stats.collections, icon: FolderOpen },
    { label: "Favorite Items", value: stats.favoriteItems, icon: Star },
    { label: "Favorite Collections", value: stats.favoriteCollections, icon: Heart },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="flex-row items-center justify-between px-5">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
          <Icon className="size-5 text-muted-foreground" />
        </Card>
      ))}
    </div>
  );
}
