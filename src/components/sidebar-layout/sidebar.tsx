"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { AppSidebarHeader } from "./sidebar-header"
import { AppSidebarFooter } from "./sidebar-footer"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { filterSidebarMenu } from "./filter-sidebarMenu"
import { TCurrentUser } from "@/context/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export type TSidebarMenuItem = {
    title: string,
    url: string,
    icon?: any,
    items?: Omit<TSidebarMenuItem, "icon" | "items">[]
}

export type TGroupMenuItem = {
    groupLabel: string,
    menuItems: TSidebarMenuItem[]
}

export function AppSidebar({
    menuItems,
    user
}: {
    menuItems: TGroupMenuItem[]
    user: NonNullable<TCurrentUser>
}) {
    const { search } = useSidebar();

    const filteredMenuItems = useMemo(() => {
        return filterSidebarMenu(menuItems, search);
    }, [search])

    return (
        <Sidebar
            variant="floating"
            // collapsible="icon"
            className="pr-0"
        >
            <AppSidebarHeader user={user} />
            <SidebarContent className="overflow-hidden">
                <ScrollArea className="max-h-full overflow-auto">
                    {
                        filteredMenuItems.map((item) => (
                            <SidebarGroup key={item.groupLabel}>
                                <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {item.menuItems.map((item) => item.items?.length
                                        ? <CollapsibleMenuItem key={item.title} item={item} />
                                        : <NonCollapsibleMenuItem key={item.title} item={item} />
                                    )}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }

                    {
                        filteredMenuItems.length === 0 && (
                            <SidebarGroup>
                                <SidebarGroupLabel>No results found!</SidebarGroupLabel>
                            </SidebarGroup>
                        )
                    }
                </ScrollArea>
            </SidebarContent>
            <AppSidebarFooter user={user} />
        </Sidebar>
    )
}

export function NonCollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const pathname = usePathname();

    const isActive = item.url === pathname;

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function CollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const { search } = useSidebar();
    const pathname = usePathname();

    const defaultOpen = useMemo<boolean>(() => {
        if (search.length > 0) return true;
        return !!item.items?.some((subItem) => `${item.url}${!!subItem.url ? `/${subItem.url}` : ''}` === pathname)
    }, [location, search])

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={defaultOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                            const url = `${item.url}${!!subItem.url ? `/${subItem.url}` : ''}`;
                            const isActive = url === pathname

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                        <Link href={item.url + (!!subItem.url ? ('/' + subItem.url) : '')} className={cn(isActive && "font-medium")}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
