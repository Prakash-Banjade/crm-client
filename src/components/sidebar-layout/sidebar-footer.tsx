import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { ChevronUp, LoaderCircle, LogOut, Monitor, Moon, Settings, Sun, SunMoon } from "lucide-react"
import { ProfileAvatar } from "../ui/avatar"
import { cn } from "@/lib/utils"
import { TCurrentUser } from "@/context/auth-provider"
import { useTransition } from "react"
import { signOut } from "@/lib/actions/auth/signout.action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export const AppSidebarFooter = ({
    user
}: {
    user: NonNullable<TCurrentUser>
}) => {
    const [isPending, startTransition] = useTransition();
    const { open } = useSidebar();
    const router = useRouter();
    const { setTheme } = useTheme();

    function handleLogout() {
        startTransition(async () => {
            try {
                await signOut();
            } catch (e) {
                toast.error("Failed to log out")
            }
        })
    }

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className={cn("h-12", !open && "grid place-items-center rounded-full")}>
                                <ProfileAvatar
                                    src={user.profileImage || undefined}
                                    name={user.firstName + " " + user.lastName}
                                    className={cn(!open ? "absolute size-8" : "size-10")}
                                />
                                {open && (
                                    <div>
                                        <p>{user.firstName + " " + user.lastName}</p>
                                        <p className="capitalize text-xs text-muted-foreground">{user.role.split("_").join(" ")}</p>
                                    </div>
                                )}
                                {open && <ChevronUp className="ml-auto" />}
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className={cn(open && "w-[--radix-popper-anchor-width]")}
                        >
                            <DropdownMenuLabel title={user.email} className="truncate">{user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/${user.role}/settings`)}>
                                <Settings /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <SunMoon />Theme
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        <Sun /> Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        <Moon /> Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        <Monitor /> System
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isPending}
                                className="text-left flex gap-2 items-center w-full px-2 py-1.5 text-sm hover:bg-secondary transition-colors select-none rounded-sm disabled:opacity-70"
                            >
                                {
                                    isPending
                                        ? <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span>Signing out...</span>
                                        </>
                                        : <span><LogOut className="inline-block size-4 mr-1" /> Sign out</span>
                                }
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}