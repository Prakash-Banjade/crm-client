import { Role } from "@/lib/types";
import { redirect } from "next/navigation";

export default function Page() {
    redirect(`${Role.SUPER_ADMIN}/dashboard`);
}