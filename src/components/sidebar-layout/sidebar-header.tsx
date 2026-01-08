import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Building2, ChevronsUpDown, Plus, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSearchForm } from "./sidebar-search-form";
import { TCurrentUser } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { useGetOrganizationOptions } from "@/lib/data-access/organization-data-hooks";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookie";
import { CookieKey } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function AppSidebarHeader({
    user
}: {
    user: NonNullable<TCurrentUser>
}) {
    const { isMobile, open } = useSidebar();
    const router = useRouter();
    const [organization, setOrganization] = useState<string | null>(user.organizationId ?? getCookie(CookieKey.ORGANIZATION_ID));

    const { data: organizations, isLoading } = useGetOrganizationOptions({
        options: {
            enabled: user.role === Role.SUPER_ADMIN
        }
    });

    const queryClient = useQueryClient();

    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className={cn(user.role === Role.SUPER_ADMIN ? "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" : "pointer-events-none")}
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Building2 className="size-5" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="truncate font-semibold">Abhyam CRM</span>
                                    <span className="text-xs mt-1 w-[150px] truncate">
                                        {
                                            isLoading
                                                ? <Skeleton className="h-2 mt-2 w-20" />
                                                : user.role === Role.SUPER_ADMIN
                                                    ? organizations?.find(b => b.value === organization)?.label
                                                        ? organizations?.find(b => b.value === organization)?.label
                                                        : "All Organizations"
                                                    : user.organizationName
                                        }
                                    </span>
                                </div>
                                {
                                    (user.role === Role.SUPER_ADMIN && !!organizations?.length) && (<ChevronsUpDown className="ml-auto" />)
                                }
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        {
                            (user.role === Role.SUPER_ADMIN && !!organizations?.length) && (
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    align="start"
                                    side={isMobile ? "bottom" : "right"}
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                        Organizations
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                        className="gap-2 p-2"
                                        onClick={() => {
                                            deleteCookie(CookieKey.ORGANIZATION_ID, {
                                                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                                                secure: process.env.NODE_ENV === 'production',
                                                domain: process.env.API_DOMAIN,
                                            })
                                            setOrganization(null);
                                            queryClient.invalidateQueries(); // invalidate all cache
                                            router.refresh();
                                        }}
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            <School className="size-4 shrink-0" />
                                        </div>
                                        All
                                    </DropdownMenuItem>
                                    {(organizations ?? []).map((organization) => (
                                        <DropdownMenuItem
                                            key={organization.value}
                                            className="gap-2 p-2"
                                            onClick={() => {
                                                setCookie(CookieKey.ORGANIZATION_ID, organization.value, {
                                                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                                                    secure: process.env.NODE_ENV === 'production',
                                                    domain: process.env.API_DOMAIN,
                                                })
                                                setOrganization(organization.value);
                                                queryClient.invalidateQueries(); // invalidate all cache
                                                router.refresh();
                                            }}
                                        >
                                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                                <School className="size-4 shrink-0" />
                                            </div>
                                            {organization.label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 p-2" onClick={() => router.push("/super_admin/organizations/new")}>
                                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                            <Plus className="size-4" />
                                        </div>
                                        <div className="font-medium text-muted-foreground">Add organization</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )
                        }
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            {open && <SidebarSearchForm />}
        </SidebarHeader>
    )
}