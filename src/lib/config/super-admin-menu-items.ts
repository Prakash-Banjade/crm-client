import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { BookOpen, Building2, CalendarCheck, FileText, Globe, LayoutDashboard, Library, MapPin, School, TrendingUp, UserCheck, Users } from "lucide-react";

export const superAdminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Operations",
        menuItems: [
            { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
            { title: "Students", url: "students", icon: Users },
            { title: "Applications", url: "applications", icon: FileText },
            { title: "Bookings", url: "bookings", icon: CalendarCheck }, // IELTS/PTE
        ]
    },
    {
        groupLabel: "Directory",
        menuItems: [
            { title: "Universities", url: "universities", icon: School },
            { title: "Courses", url: "courses", icon: BookOpen },
            { title: "Countries", url: "countries", icon: Globe },
            { title: "Learning Resources", url: "learning-resources", icon: Library },
        ]
    },
    {
        groupLabel: "Partners & Team",
        menuItems: [
            { title: "Counselors", url: "counselors", icon: UserCheck },
            { title: "BDE", url: "bde", icon: TrendingUp },
            { title: "Regional Incharge", url: "regional-incharge", icon: MapPin },
            { title: "Organizations", url: "organizations", icon: Building2 }, // Partner agencies/B2B
        ]
    },
]