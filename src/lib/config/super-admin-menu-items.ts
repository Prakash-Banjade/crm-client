import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { BookOpen, Building2, CalendarCheck, FileText, Globe, LayoutDashboard, Library, MapPin, School, TrendingUp, UserCheck, Users } from "lucide-react";
import { Role } from "../types";

export const superAdminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Operations",
        menuItems: [
            { title: "Dashboard", url: `/${Role.SUPER_ADMIN}/dashboard`, icon: LayoutDashboard },
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
            { title: "Universities", url: `/universities`, icon: School },
            {
                title: "Courses",
                url: `/courses`,
                icon: BookOpen,
                items: [
                    { title: "Manage Courses", url: `` },
                    { title: "Advance Search", url: `search` },
                    { title: "Categories", url: `categories` },
                ]
            },
            { title: "Countries", url: `/countries`, icon: Globe },
            { title: "Learning Resources", url: `/${Role.SUPER_ADMIN}/learning-resources`, icon: Library },
        ]
    },
    {
        groupLabel: "Partners & Team",
        menuItems: [
            { title: "Counselors", url: `/counselors`, icon: UserCheck },
            { title: "BDE", url: `/bdes`, icon: TrendingUp },
            { title: "Regional Incharge", url: `/regional-incharge`, icon: MapPin },
            { title: "Organizations", url: `/organizations`, icon: Building2 }, // Partner agencies/B2B
        ]
    },
]