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
            { title: "Applications", url: `/${Role.SUPER_ADMIN}/applications`, icon: FileText },
            { title: "IELTS/PTE Bookings", url: `/${Role.SUPER_ADMIN}/bookings`, icon: CalendarCheck },
        ]
    },
    {
        groupLabel: "Directory",
        menuItems: [
            { title: "Universities", url: `/${Role.SUPER_ADMIN}/universities`, icon: School },
            { title: "Courses", url: `/${Role.SUPER_ADMIN}/courses`, icon: BookOpen },
            { title: "Countries", url: `/${Role.SUPER_ADMIN}/countries`, icon: Globe },
            { title: "Learning Resources", url: `/${Role.SUPER_ADMIN}/learning-resources`, icon: Library },
        ]
    },
    {
        groupLabel: "Partners & Team",
        menuItems: [
            { title: "Counselors", url: `/counselors`, icon: UserCheck },
            { title: "BDE", url: `/${Role.SUPER_ADMIN}/bdes`, icon: TrendingUp },
            { title: "Regional Incharge", url: `/${Role.SUPER_ADMIN}/regional-incharge`, icon: MapPin },
            { title: "Organizations", url: `/${Role.SUPER_ADMIN}/organizations`, icon: Building2 }, // Partner agencies/B2B
        ]
    },
]