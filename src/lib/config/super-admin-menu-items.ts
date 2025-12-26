import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { LayoutDashboard } from "lucide-react";

export const superAdminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Dashboard",
        menuItems: [
            {
                title: "Dashboard",
                url: "dashboard",
                icon: LayoutDashboard,
            },
        ]
    },
]