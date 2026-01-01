import { useAuth } from "@/context/auth-provider";
import { signOut } from "@/lib/actions/auth/signout.action";
import { CookieKey } from "@/lib/constants";
import { deleteCookie } from "@/lib/cookie";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function useLogoutMutation() {
    const { setSession } = useAuth();
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        startTransition(async () => {
            try {
                await signOut();

                Object.values(CookieKey).forEach(key => deleteCookie(key)); // remove cookie
                queryClient.clear();
                setSession(null);
                router.replace(`/auth/sign-in?callbackUrl=${pathname}`);
            } catch (e) {
                console.log(e);
                toast.error("Failed to log out")
            }
        })
    }

    return {
        handleLogout,
        isPending,
    }
}