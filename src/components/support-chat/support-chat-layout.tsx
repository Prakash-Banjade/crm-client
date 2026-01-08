"use client";

import { ProfileAvatar } from "@/components/ui/avatar";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { TSupportChat, TSupportChatResponse } from "@/lib/types/support-chat.type";
import { cn, createQueryString } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/lib/axios-client";
import { useAuth } from "@/context/auth-provider";

type Props = {
    children: React.ReactNode;
}

const DEFAULT_TAKE = 10;

export default function SupportChatLayout({ children }: Props) {
    const { id: supportChatId } = useParams();
    const axios = useAxios();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [QueryKey.SUPPORT_CHAT],
        queryFn: async ({ pageParam = 1 }) => {
            const queryString = createQueryString({
                page: pageParam,
                take: DEFAULT_TAKE,
            });
            const response = await axios.get<TSupportChatResponse>(`/${QueryKey.SUPPORT_CHAT}?${queryString}`);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    });

    const chats = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div className="h-full px-6 relative flex gap-6">
            <aside className="h-[calc(100%-7px)] border bg-sidebar w-[400px]">
                <header className="bg-blue-600 flex items-center justify-between text-white p-4">
                    <section>
                        <h2 className="text-lg font-semibold">Support Chat Admin</h2>
                        <p className="text-sm">Manage support conversations</p>
                    </section>
                    <Button
                        onClick={() => {
                            // invalidate the support chats and currently opened chat messages
                            refetch();
                            queryClient.invalidateQueries({ queryKey: [QueryKey.SUPPORT_CHAT_MESSAGES, supportChatId] });
                        }}
                        size={'icon-lg'}
                        variant={'ghost'}
                        disabled={isRefetching}
                        aria-label="Refresh"
                    >
                        <RefreshCcw className={cn(isRefetching && "animate-spin")} />
                    </Button>
                </header>
                <RenderChats data={chats} isLoading={isLoading} supportChatId={supportChatId as string} />
                {
                    hasNextPage && !isFetchingNextPage && (
                        <div className="flex items-center justify-center mt-10">
                            <Button
                                aria-label="Load More"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
                                Load More
                            </Button>
                        </div>
                    )
                }
                {
                    isFetchingNextPage && (
                        <SupportChatsLoading />
                    )
                }
            </aside>
            <section className="h-full flex-1">
                {children}
            </section>
        </div>
    )
}

function RenderChats({ data, isLoading, supportChatId }: { data: TSupportChat[]; isLoading: boolean; supportChatId: string }) {
    const { user } = useAuth();

    if (isLoading) return <SupportChatsLoading />;
    if (!data.length) return null;

    return (
        <ul>
            {
                data.map((chat) => {
                    const hasLastMessage = !!chat.latestMessageCreatedAt && chat.latestMessageSenderId !== user?.accountId;
                    const hasLastMessageSeen = !hasLastMessage || !!chat.latestMessageSeenAt;

                    return (
                        <li key={chat.id} className="border-b">
                            <Link
                                href={`/support-chat/${chat.id}`}
                                className={cn(
                                    "p-4 py-6 block hover:bg-accent/20",
                                    supportChatId === chat.id && "bg-secondary hover:bg-secondary ring-primary/20 ring-1"
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
                                            <p className={cn("capitalize font-medium", hasLastMessageSeen && "text-muted-foreground")}>{chat.sender}</p>
                                        </header>
                                        <time className="text-xs text-muted-foreground">{formatDate(chat.latestMessageCreatedAt, 'PPpp')}</time>
                                    </div>
                                    {!hasLastMessageSeen && (
                                        <div className="size-2 bg-green-500 rounded-full" />
                                    )}
                                </div>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

function SupportChatsLoading() {
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