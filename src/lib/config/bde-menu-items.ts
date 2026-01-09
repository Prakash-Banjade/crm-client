import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { BookOpen, BookSearch, Building2, Globe, LayoutDashboard, Library, School } from "lucide-react";
import { Role } from "../types";

export const bdeSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Operations",
        menuItems: [
            { title: "Dashboard", url: `/${Role.BDE}/dashboard`, icon: LayoutDashboard },
        ]
    },
    {
        groupLabel: "Directory",
        menuItems: [
            { title: "Program Search", url: `/courses/search`, icon: BookSearch },
            { title: "Learning Resources", url: `/learning-resources`, icon: Library },
        ]
    },
    {
        groupLabel: "Partners & Team",
        menuItems: [
            { title: "Organizations", url: `/organizations`, icon: Building2 }, // Partner agencies/B2B
        ]
    },
]