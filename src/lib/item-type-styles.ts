import {
  Code,
  File,
  Image,
  Link,
  type LucideIcon,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

interface ItemTypeStyle {
  icon: LucideIcon;
  className: string;
  borderClassName: string;
  bgClassName: string;
}

// Keyed by ItemType.icon; colors match ItemType.color in mock data
export const ITEM_TYPE_STYLES: Record<string, ItemTypeStyle> = {
  Code: {
    icon: Code,
    className: "text-blue-500",
    borderClassName: "border-l-blue-500",
    bgClassName: "bg-blue-500/10",
  },
  Sparkles: {
    icon: Sparkles,
    className: "text-violet-500",
    borderClassName: "border-l-violet-500",
    bgClassName: "bg-violet-500/10",
  },
  Terminal: {
    icon: Terminal,
    className: "text-orange-500",
    borderClassName: "border-l-orange-500",
    bgClassName: "bg-orange-500/10",
  },
  StickyNote: {
    icon: StickyNote,
    className: "text-yellow-300",
    borderClassName: "border-l-yellow-300",
    bgClassName: "bg-yellow-300/10",
  },
  File: {
    icon: File,
    className: "text-gray-500",
    borderClassName: "border-l-gray-500",
    bgClassName: "bg-gray-500/10",
  },
  Image: {
    icon: Image,
    className: "text-pink-500",
    borderClassName: "border-l-pink-500",
    bgClassName: "bg-pink-500/10",
  },
  Link: {
    icon: Link,
    className: "text-emerald-500",
    borderClassName: "border-l-emerald-500",
    bgClassName: "bg-emerald-500/10",
  },
};

export const DEFAULT_ITEM_TYPE_STYLE: ItemTypeStyle = {
  icon: File,
  className: "text-muted-foreground",
  borderClassName: "border-l-border",
  bgClassName: "bg-muted",
};

export function getItemTypeStyle(icon: string | undefined): ItemTypeStyle {
  return (icon && ITEM_TYPE_STYLES[icon]) || DEFAULT_ITEM_TYPE_STYLE;
}
