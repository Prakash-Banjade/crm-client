import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { BookSearch, CalendarCheck, FileText, LayoutDashboard, Library, UserCheck, Users } from "lucide-react";
import { Role } from "../types";

export const adminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Operations",
        menuItems: [
            { title: "Dashboard", url: `/${Role.ADMIN}/dashboard`, icon: LayoutDashboard },
            {
                title: "Students",
                url: `/students`,
                icon: Users,
                items: [
                    { title: "Application Students", url: `application` },
                    { title: "Lead Students", url: `lead` },
                ]
            },
            { title: "Applications", url: `/applications`, icon: FileText },
            { title: "IELTS/PTE Bookings", url: `/bookings`, icon: CalendarCheck },
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
            { title: "Counselors", url: `/counselors`, icon: UserCheck },
        ]
    },
]