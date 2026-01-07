"use client";

import { ProfileAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { TSupportChatResponse } from "@/lib/types/support-chat.type";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {
    children: React.ReactNode;
}

export default function SupportChatLayout({ children }: Props) {
    const { id } = useParams();

    const { data, isLoading } = useFetch<TSupportChatResponse>({
        endpoint: QueryKey.SUPPORT_CHAT,
        queryKey: [QueryKey.SUPPORT_CHAT],
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="h-full px-6 relative flex gap-6">
            <aside className="h-[calc(100%-7px)] border bg-sidebar w-[400px]">
                <header className="bg-blue-600 text-white p-4">
                    <h2 className="text-lg font-semibold">Support Chat Admin</h2>
                    <p className="text-sm">Manage support conversations</p>
                </header>
                <ul>
                    {
                        data?.data?.map((chat) => (
                            <li key={chat.id} className="border-b">
                                <Link
                                    href={`/support-chat/${chat.id}`}
                                    className={cn(
                                        "p-4 py-6 block hover:bg-accent/20",
                                        id === chat.id && "bg-accent/50 hover:bg-accent/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <ProfileAvatar
                                            src={undefined}
                                            name={chat.sender}
                                            className="size-12"
                                        />
                                        <div className="flex-1">
                                            <header className="flex justify-between items-center gap-2">
                                                <p className="capitalize font-medium">{chat.sender}</p>
                                                <Badge
                                                    variant="success"
                                                    className="capitalize"
                                                >
                                                    New
                                                </Badge>
                                            </header>
                                            <time className="text-xs text-muted-foreground">{formatDate(chat.latestMessageCreatedAt, 'PPpp')}</time>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </aside>
            <section className="h-full flex-1">
                {children}
            </section>
        </div>
    )
}