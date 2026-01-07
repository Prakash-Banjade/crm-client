"use client";

import { ProfileAvatar } from "@/components/ui/avatar";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { TSupportChatResponse } from "@/lib/types/support-chat.type";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

type Props = {
    children: React.ReactNode;
}

export default function SupportChatLayout({ children }: Props) {
    const { id } = useParams();

    const { data, isLoading, refetch, isRefetching } = useFetch<TSupportChatResponse>({
        endpoint: QueryKey.SUPPORT_CHAT,
        queryKey: [QueryKey.SUPPORT_CHAT],
    });

    return (
        <div className="h-full px-6 relative flex gap-6">
            <aside className="h-[calc(100%-7px)] border bg-sidebar w-[400px]">
                <header className="bg-blue-600 flex items-center justify-between text-white p-4">
                    <section>
                        <h2 className="text-lg font-semibold">Support Chat Admin</h2>
                        <p className="text-sm">Manage support conversations</p>
                    </section>
                    <Button onClick={() => refetch()} size={'icon-lg'} variant={'ghost'} disabled={isRefetching}>
                        <RefreshCcw className={cn(isRefetching && "animate-spin")} />
                    </Button>
                </header>
                <RenderChats data={data} isLoading={isLoading} id={id as string} />
            </aside>
            <section className="h-full flex-1">
                {children}
            </section>
        </div>
    )
}

function RenderChats({ data, isLoading, id }: { data: TSupportChatResponse | undefined; isLoading: boolean; id: string }) {

    if (isLoading) return <SupportChatLayoutSkeleton />;

    if (!data) return null;

    return (
        <ul>
            {
                data?.data?.map((chat) => (
                    <li key={chat.id} className="border-b">
                        <Link
                            href={`/support-chat/${chat.id}`}
                            className={cn(
                                "p-4 py-6 block hover:bg-accent/20",
                                id === chat.id && "bg-secondary hover:bg-secondary ring-primary/20 ring-1"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <ProfileAvatar
                                    src={undefined}
                                    name={chat.sender}
                                    className="size-14"
                                />
                                <div className="flex-1">
                                    <header className="flex justify-between items-center gap-2">
                                        <p className={cn("capitalize font-medium", chat.latestMessageSeenAt && "text-muted-foreground")}>{chat.sender}</p>
                                        {/* <Badge
                                                    variant="success"
                                                    className="capitalize"
                                                >
                                                    New
                                                </Badge> */}
                                    </header>
                                    <time className="text-xs text-muted-foreground">{formatDate(chat.latestMessageCreatedAt, 'PPpp')}</time>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}

function SupportChatLayoutSkeleton() {
    return (
        <ul>
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="border-b p-4 py-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-[120px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}