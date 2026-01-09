"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import AppBreadCrumb from "./app-bread-crumb";
import { TCurrentUser } from "@/context/auth-provider";
import { Role } from "@/lib/types";
import { superAdminSidebarMenuItems } from "@/lib/config/super-admin-menu-items";
import { adminSidebarMenuItems } from "@/lib/config/admin-menu-items";
import NotificationBellIcon from "./notification-view";
import { counselorSidebarMenuItems } from "@/lib/config/counselor-menu-items";
import { bdeSidebarMenuItems } from "@/lib/config/bde-menu-items";

const roleToMenuItemsMap = {
    [Role.SUPER_ADMIN]: superAdminSidebarMenuItems,
    [Role.ADMIN]: adminSidebarMenuItems,
    [Role.COUNSELOR]: counselorSidebarMenuItems,
    [Role.BDE]: bdeSidebarMenuItems,
    [Role.USER]: [],
}

export default function SidebarLayout({
    children,
    user
}: {
    children: React.ReactNode
    user: NonNullable<TCurrentUser>
}) {
    const menuItems = roleToMenuItemsMap[user.role];

    return (
        <SidebarProvider>
            <AppSidebar menuItems={menuItems} user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <AppBreadCrumb user={user} menuItems={menuItems} />

                    <NotificationBellIcon />
                </header>
                <main className="h-full">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}