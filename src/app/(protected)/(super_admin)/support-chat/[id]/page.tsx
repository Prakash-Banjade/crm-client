"use client";

import { TCurrentUser, useAuth } from '@/context/auth-provider';
import { useServerAction } from '@/hooks/use-server-action';
import { useFetch } from '@/hooks/useFetch';
import { sendSupportMessage } from '@/lib/actions/support-chat.action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { supportChatDefaultValues, supportChatSchema, TSupportChatSchema } from '@/lib/schema/support-chat.schema';
import { TSupportChatMessage, TSupportChatMessagesResponse } from '@/lib/types/support-chat.type';
import { cn, createQueryString } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { use, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Send } from 'lucide-react';
import { formatDate, isSameYear, isToday } from 'date-fns';

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function Page({ params }: Props) {
    const { id } = use(params);
    const [messages, setMessages] = useState<TSupportChatMessage[]>([]);
    const { user } = useAuth();

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
            // since last message was added to messages, remove it on error
            setMessages(prev => {
                const array = [...prev];
                array.pop();
                return array;
            })
        },
        toastOnSuccess: false,
    });

    function onSubmit(data: TSupportChatSchema) {
        if (!user) return;

        // immediately add message to the list and reset form
        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                content: data.content,
                createdAt: new Date().toISOString(),
                sender: {
                    id: user.accountId,
                    lowerCasedFullName: user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase(),
                    role: user.role,
                },
            }
        ]);

        form.reset({
            ...supportChatDefaultValues,
            supportChatId: data.supportChatId,
        });

        form.setFocus("content");

        send(data);
    }

    if (!user) return null;

    return (
        <div className='bg-card flex flex-col h-[calc(100%-7px)] border'>
            <section className='flex-1'>
                <RenderMessages
                    user={user}
                    id={id}
                    messages={messages}
                    setMessages={setMessages}
                />
            </section>

            <section className='mt-auto mb-2 mx-2'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <InputGroup>
                        <InputGroupTextarea
                            key={form.formState.submitCount}
                            placeholder="Type your message here..."
                            minLength={1}
                            maxLength={500}
                            className="max-h-40"
                            {...form.register("content")}
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

function RenderMessages({
    messages,
    user,
    id,
    setMessages,
}: {
    user: NonNullable<TCurrentUser>
    id: string
    messages: TSupportChatMessage[]
    setMessages: React.Dispatch<React.SetStateAction<TSupportChatMessage[]>>
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useFetch<TSupportChatMessagesResponse>({
        endpoint: QueryKey.SUPPORT_CHAT_MESSAGES,
        queryString: createQueryString({
            supportChatId: id
        }),
        queryKey: [QueryKey.SUPPORT_CHAT_MESSAGES, id],
    });

    useEffect(() => {
        if (data?.data) {
            setMessages(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <div className="flex-1 overflow-y-auto bg-card">
                <ScrollArea className='h-[calc(100vh-220px)] p-4'>
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-8">
                            <p>Start a conversation with our support team!</p>
                        </div>
                    ) : isLoading ? (
                        <div className="py-20 flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => (
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
                                        <span className="text-xs opacity-70 mt-1 block">
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
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
            </div>

        </>
    )
}