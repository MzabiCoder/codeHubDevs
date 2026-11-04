import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { ChevronDown, Circle, Folder, Layers, Settings, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CollectionSummary,
  getFavoriteCollections,
  getRecentCollections,
} from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getItemTypeStyle } from "@/lib/item-type-styles";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const RECENT_COLLECTIONS_LIMIT = 5;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pt-2 pb-1 text-[0.7rem] font-medium tracking-wider text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
      {children}
    </p>
  );
}

function MenuSkeleton({ count }: { count: number }) {
  return (
    <SidebarMenu>
      {Array.from({ length: count }, (_, i) => (
        <SidebarMenuItem key={i} className="flex h-8 items-center gap-2 px-2">
          <Skeleton className="size-4 rounded-md" />
          <Skeleton className="h-4 flex-1 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function CollectionLink({ collection }: { collection: CollectionSummary }) {
  const accent = getItemTypeStyle(collection.itemTypes[0]?.icon);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={collection.name}>
        <Link href={`/collections/${collection.id}`}>
          {collection.isFavorite ? (
            <Folder className="text-muted-foreground" />
          ) : (
            <Circle className={cn("fill-current", accent.className)} />
          )}
          <span>{collection.name}</span>
        </Link>
      </SidebarMenuButton>
      {collection.isFavorite ? (
        <SidebarMenuBadge>
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
        </SidebarMenuBadge>
      ) : (
        <SidebarMenuBadge className="text-muted-foreground">
          {collection.itemCount}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

async function TypesMenu() {
  await connection();
  const itemTypes = await getSystemItemTypes();

  return (
    <SidebarMenu>
      {itemTypes.map((type) => {
        const { icon: Icon, className } = getItemTypeStyle(type.icon);
        return (
          <SidebarMenuItem key={type.id}>
            <SidebarMenuButton asChild tooltip={type.name}>
              <Link href={`/items/${type.slug}`}>
                <Icon className={className} />
                <span>{type.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuBadge className="text-muted-foreground">
              {type.itemCount}
            </SidebarMenuBadge>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

async function CollectionsMenu() {
  await connection();
  const [favorites, recent] = await Promise.all([
    getFavoriteCollections(),
    getRecentCollections(RECENT_COLLECTIONS_LIMIT, { excludeFavorites: true }),
  ]);

  return (
    <>
      <SectionLabel>Favorites</SectionLabel>
      <SidebarMenu>
        {favorites.map((collection) => (
          <CollectionLink key={collection.id} collection={collection} />
        ))}
      </SidebarMenu>
      <SectionLabel>Recent</SectionLabel>
      <SidebarMenu>
        {recent.map((collection) => (
          <CollectionLink key={collection.id} collection={collection} />
        ))}
      </SidebarMenu>
    </>
  );
}

function TypesGroup() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Types
            <ChevronDown className="ml-1 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <Suspense fallback={<MenuSkeleton count={7} />}>
              <TypesMenu />
            </Suspense>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function CollectionsGroup() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Collections
            <ChevronDown className="ml-1 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <Suspense fallback={<MenuSkeleton count={5} />}>
              <CollectionsMenu />
            </Suspense>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all collections">
                  <Link href="/collections" className="text-muted-foreground">
                    <span>View all collections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function UserArea() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-1">
        <SidebarMenuButton size="lg" tooltip={currentUser.name}>
          <Avatar className="size-8">
            {currentUser.image && (
              <AvatarImage src={currentUser.image} alt={currentUser.name} />
            )}
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-medium">{currentUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
        </SidebarMenuButton>
        <SidebarMenuButton
          aria-label="Settings"
          className="size-8 shrink-0 justify-center group-data-[collapsible=icon]:hidden"
        >
          <Settings className="text-muted-foreground" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b">
        <Link href="/dashboard" className="flex items-center gap-2 px-1">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-violet-600 text-white">
            <Layers className="size-4" />
          </span>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            DevStash
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <TypesGroup />
        <SidebarSeparator className="mx-0" />
        <CollectionsGroup />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <UserArea />
      </SidebarFooter>
    </Sidebar>
  );
}
