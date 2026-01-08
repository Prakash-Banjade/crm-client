"use client";

import { TCurrentUser, useAuth } from '@/context/auth-provider';
import { useServerAction } from '@/hooks/use-server-action';
import { useFetch } from '@/hooks/useFetch';
import { markAsSeen, sendSupportMessage } from '@/lib/actions/support-chat.action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { supportChatDefaultValues, supportChatSchema, TSupportChatSchema } from '@/lib/schema/support-chat.schema';
import { TSingleSupportChat, TSupportChatMessage, TSupportChatMessagesResponse, TSupportChatResponse } from '@/lib/types/support-chat.type';
import { cn, createQueryString } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { use, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Send } from 'lucide-react';
import { formatDate, isSameYear, isToday } from 'date-fns';
import { ProfileAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '@/lib/axios-client';

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function Page({ params }: Props) {
    const { id } = use(params);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm<TSupportChatSchema>({
        resolver: zodResolver(supportChatSchema),
        defaultValues: {
            ...supportChatDefaultValues,
            supportChatId: id,
        },
    });

    const { isPending: isSending, mutate: send } = useServerAction({
        action: sendSupportMessage,
        onError: () => {
            // rollback optimistic update
            queryClient.setQueryData<InfiniteData<TSupportChatMessagesResponse>>(
                [QueryKey.SUPPORT_CHAT_MESSAGES, id],
                (oldData) => {
                    if (!oldData || !oldData.pages.length) return oldData;
                    const newPages = [...oldData.pages];
                    // Remove the optimistically added message (first item of first page)
                    newPages[0] = {
                        ...newPages[0],
                        data: newPages[0].data.slice(1)
                    };
                    return { ...oldData, pages: newPages };
                }
            );
        },
        toastOnSuccess: false,
    });

    function onSubmit(data: TSupportChatSchema) {
        if (!user) return;

        const newMessage: TSupportChatMessage = {
            id: crypto.randomUUID(),
            content: data.content,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.accountId,
                lowerCasedFullName: user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase(),
                role: user.role,
            },
            seenAt: null,
        };

        // Optimistic update
        queryClient.setQueryData<InfiniteData<TSupportChatMessagesResponse>>(
            [QueryKey.SUPPORT_CHAT_MESSAGES, id],
            (oldData) => {
                if (!oldData) {
                    return {
                        pages: [{
                            data: [newMessage],
                            meta: {
                                hasNextPage: false, hasPreviousPage: false, itemCount: 1, page: 1, pageCount: 1, take: 10
                            }
                        }],
                        pageParams: [1]
                    } as InfiniteData<TSupportChatMessagesResponse>;
                }

                const newPages = [...oldData.pages];
                if (newPages.length > 0) {
                    newPages[0] = {
                        ...newPages[0],
                        data: [newMessage, ...newPages[0].data]
                    };
                }
                return {
                    ...oldData,
                    pages: newPages,
                };
            }
        );

        form.reset({
            ...supportChatDefaultValues,
            supportChatId: data.supportChatId,
        });

        textareaRef.current?.focus();

        send(data);
    }

    if (!user) return null;

    return (
        <div className='bg-card flex flex-col h-[calc(100%-7px)] border'>
            <ChatHeader id={id} />

            <section className='flex-1'>
                <RenderMessages
                    user={user}
                    supportChatId={id}
                />
            </section>

            <section className='mt-auto mb-2 mx-2'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <InputGroup>
                        <InputGroupTextarea
                            ref={textareaRef}
                            placeholder="Type your message here..."
                            minLength={1}
                            maxLength={500}
                            className="max-h-40"
                            value={form.watch("content")}
                            onChange={(e) => form.setValue("content", e.target.value)}
                            onKeyDown={e => {
                                // if ctrl + enter, submit form
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                }
                            }}
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton
                                type='submit'
                                variant="default"
                                className="size-8 ml-auto"
                                disabled={isSending}
                            >
                                {
                                    isSending ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span className="sr-only">Send</span>
                                        </>
                                    )
                                }
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </form>
            </section>
        </div>
    )
}

function ChatHeader({ id }: { id: string }) {
    const { data, isLoading } = useFetch<TSingleSupportChat>({
        endpoint: `${QueryKey.SUPPORT_CHAT}/${id}`,
        queryKey: [QueryKey.SUPPORT_CHAT, id],
    });

    if (isLoading) return (
        <ChatHeaderSkeleton />
    );

    if (!data) return null;

    return (
        <header className='bg-secondary p-4 flex items-center gap-6'>
            <ProfileAvatar
                src={undefined}
                name={data.account.lowerCasedFullName}
                className="size-12"
            />
            <section>
                <h2 className="font-semibold capitalize">{data.account.lowerCasedFullName}</h2>
                <p className="text-sm">{data.account.organization.name}</p>
            </section>
            <Badge
                variant="outline"
                className="capitalize"
            >
                {data.account.role}
            </Badge>
        </header>
    )
}

function ChatHeaderSkeleton() {
    return (
        <header className='bg-secondary/10 p-4 flex items-center gap-6'>
            <Skeleton className="size-12 rounded-full" />
            <section className='flex-1 space-y-2'>
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
            </section>
        </header>
    )
}

const DEFAULT_TAKE = 30;

function RenderMessages({
    user,
    supportChatId,
}: {
    user: NonNullable<TCurrentUser>
    supportChatId: string
}) {
    const queryClient = useQueryClient();
    const axios = useAxios();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [QueryKey.SUPPORT_CHAT_MESSAGES, supportChatId],
        queryFn: async ({ pageParam = 1 }) => {
            const queryString = createQueryString({
                supportChatId,
                take: DEFAULT_TAKE,
                page: pageParam
            });
            const response = await axios.get<TSupportChatMessagesResponse>(`/${QueryKey.SUPPORT_CHAT_MESSAGES}?${queryString}`);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    });

    const messages = data?.pages.flatMap((page) => page.data).slice().reverse() ?? [];

    const lastMarkedSeenIdRef = useRef<string | null>(null);

    const { mutate: markSeen } = useServerAction({
        action: markAsSeen,
        toastOnSuccess: false,
        toastOnError: false,
    });

    useEffect(() => {
        if (data?.pages[0]?.data.length) {
            // mark latest message as seen (first item in first page)
            const latestMessage = data.pages[0].data[0];
            const lastMessageId = latestMessage?.id;

            if (lastMessageId && !latestMessage.seenAt && latestMessage.sender.id !== user.accountId && lastMarkedSeenIdRef.current !== lastMessageId) {
                lastMarkedSeenIdRef.current = lastMessageId;
                markSeen(lastMessageId);

                // update the corresponding conversation lastMessageSeenAt on the side
                queryClient.setQueryData([QueryKey.SUPPORT_CHAT], (oldData: InfiniteData<TSupportChatResponse, unknown> | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                            return {
                                ...page,
                                data: page.data.map((item) => {
                                    if (item.id === supportChatId && !item.latestMessageSeenAt) {
                                        return {
                                            ...item,
                                            latestMessageSeenAt: new Date().toISOString(),
                                        }
                                    }
                                    return item;
                                })
                            }
                        })
                    }
                });
            }
        }
    }, [data, supportChatId, queryClient, markSeen, user.accountId]);

    // Handle scroll to load more
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleScroll = () => {
            if (viewport.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
                setPrevScrollHeight(viewport.scrollHeight);
                fetchNextPage();
            }
        };

        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Restore scroll position after loading more
    React.useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (prevScrollHeight > 0 && viewport) {
            const newScrollHeight = viewport.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;
            viewport.scrollTop = scrollDiff;
            setPrevScrollHeight(0);
        }
    }, [messages, prevScrollHeight]);

    // Track the last message ID to detect if we received a NEW message (at the bottom)
    const lastMessageRef = useRef<string | null>(null);

    // Initial scroll to bottom
    useEffect(() => {
        if (messages.length > 0 && !lastMessageRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            lastMessageRef.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    // Scroll to bottom ONLY when a NEW message is added (tail of the list)
    useEffect(() => {
        if (messages.length === 0) return;

        const currentLastMessageId = messages[messages.length - 1].id;

        // If the last message ID has changed, it means we have a new message at the bottom.
        // We do NOT want to scroll if we just loaded older messages (which changes messages array but NOT the last message ID usually, unless it was empty before)
        if (lastMessageRef.current && lastMessageRef.current !== currentLastMessageId) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        lastMessageRef.current = currentLastMessageId;
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto bg-card h-full">
            <ScrollArea
                className='h-[calc(100vh - 300px)]! p-4'
                style={{
                    height: `calc(100vh - 300px)`
                }}
                viewportRef={viewportRef}
            >
                {isLoading ? (
                    <div className="py-20 flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-2">
                                <Spinner className="size-4" />
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground mt-8">
                                <p>Start a conversation with our support team!</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(`flex`, message.sender.id === user.accountId ? 'justify-end' : 'justify-start')}
                                >
                                    <div className='max-w-[80%]'>
                                        <div
                                            className={cn(
                                                `px-4 py-2`,
                                                message.sender.id === user.accountId
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-secondary'
                                            )}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <span className={cn("text-xs opacity-70 mt-1 block", message.sender.id === user.accountId ? 'text-right' : 'text-left')}>
                                            {
                                                isToday(message.createdAt)
                                                    ? formatDate(message.createdAt, 'h:mm a')
                                                    : isSameYear(message.createdAt, new Date())
                                                        ? formatDate(message.createdAt, 'MMM d, h:mm a')
                                                        : formatDate(message.createdAt, 'MMM d, yyyy h:mm a')
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}