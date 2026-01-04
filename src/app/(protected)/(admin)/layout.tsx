import SidebarLayout from "@/components/sidebar-layout/sidebar-layout";
import { AuthProvider } from "@/context/auth-provider";
import { CookieKey } from "@/lib/constants";
import { requireAuth } from "@/lib/require-auth";
import { Role } from "@/lib/types";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Abhyam CRM",
    description: "Complete 360° CRM Solution for Education Consultancies",
};

export default async function SuperAdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await requireAuth({ roles: [Role.ADMIN] });

    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKey.ACCESS_TOKEN)?.value || "";

    return (
        <AuthProvider initialUser={user} initialAccessToken={token}>
            <SidebarLayout user={user}>
                {children}
            </SidebarLayout>
        </AuthProvider>
    );
}
