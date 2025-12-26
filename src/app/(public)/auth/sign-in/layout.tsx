import { getSession } from "@/lib/get-session";

type Props = {
    children: React.ReactNode
}

export default async function SignInLayout({ children }: Props) {
    const user = await getSession();

    return children;
}