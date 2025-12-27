import "server-only";

import { getSession } from "./get-session";
import { TCurrentUser } from "@/context/auth-provider";
import { Role } from "./types";
import { redirect } from "next/navigation";

export async function requireAuth({
    role,
    onForbiddenResource,
    callbackUrl = "/"
}: {
    role: Role
    onForbiddenResource?: () => never
    callbackUrl?: string
}): Promise<NonNullable<TCurrentUser>> {
    const user = await getSession();

    if (!user) redirect("/auth/sign-in?callbackUrl=" + callbackUrl);

    if (user.role !== role) {
        if (onForbiddenResource) {
            onForbiddenResource()
        }

        redirect("/" + user.role + "/dashboard");
    }

    return user;
}