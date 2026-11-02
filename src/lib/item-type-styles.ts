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
}

// Keyed by ItemType.icon; text colors match ItemType.color in mock data
export const ITEM_TYPE_STYLES: Record<string, ItemTypeStyle> = {
  Code: { icon: Code, className: "text-blue-500" },
  Sparkles: { icon: Sparkles, className: "text-violet-500" },
  Terminal: { icon: Terminal, className: "text-orange-500" },
  StickyNote: { icon: StickyNote, className: "text-yellow-300" },
  File: { icon: File, className: "text-gray-500" },
  Image: { icon: Image, className: "text-pink-500" },
  Link: { icon: Link, className: "text-emerald-500" },
};

export const DEFAULT_ITEM_TYPE_STYLE: ItemTypeStyle = {
  icon: File,
  className: "text-muted-foreground",
};
