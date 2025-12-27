import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { BookOpen, Building2, CalendarCheck, FileText, Globe, LayoutDashboard, Library, MapPin, School, TrendingUp, UserCheck, Users } from "lucide-react";
import { Role } from "../types";

export const superAdminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Operations",
        menuItems: [
            { title: "Dashboard", url: `/${Role.SUPER_ADMIN}/dashboard`, icon: LayoutDashboard },
            { title: "Students", url: `/${Role.SUPER_ADMIN}/students`, icon: Users },
            { title: "Applications", url: `/${Role.SUPER_ADMIN}/applications`, icon: FileText },
            { title: "Bookings", url: `/${Role.SUPER_ADMIN}/bookings`, icon: CalendarCheck }, // IELTS/PTE
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
            { title: "Counselors", url: `/${Role.SUPER_ADMIN}/counselors`, icon: UserCheck },
            { title: "BDE", url: `/${Role.SUPER_ADMIN}/bde`, icon: TrendingUp },
            { title: "Regional Incharge", url: `/${Role.SUPER_ADMIN}/regional-incharge`, icon: MapPin },
            { title: "Organizations", url: `/${Role.SUPER_ADMIN}/organizations`, icon: Building2 }, // Partner agencies/B2B
        ]
    },
]