import "server-only";

import { getSession } from "./get-session";
import { TCurrentUser } from "@/context/auth-provider";
import { Role } from "./types";
import { redirect } from "next/navigation";

export async function requireAuth({
    roles,
    onForbiddenResource,
    callbackUrl = "/"
}: {
    roles: Role[]
    onForbiddenResource?: () => never
    callbackUrl?: string
}): Promise<NonNullable<TCurrentUser>> {
    const user = await getSession();

    if (!user) redirect("/auth/sign-in?callbackUrl=" + callbackUrl);

    if (!roles.includes(user.role)) {
        if (onForbiddenResource) {
            onForbiddenResource()
        }

        redirect("/" + user.role + "/dashboard");
    }

    return user;
}