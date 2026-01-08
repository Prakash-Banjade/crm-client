"use client";

import { TCurrentUser, useAuth } from "@/context/auth-provider"
import { Role } from "@/lib/types";
import { Button } from "../ui/button";
import { Activity, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { TSupportChatMessage, TSupportChatMessagesResponse } from "@/lib/types/support-chat.type";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { cn, createQueryString } from "@/lib/utils";
import { useServerAction } from "@/hooks/use-server-action";
import { sendSupportMessage } from "@/lib/actions/support-chat.action";
import { useForm } from "react-hook-form";
import { supportChatDefaultValues, supportChatSchema, TSupportChatSchema } from "@/lib/schema/support-chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { Spinner } from "../ui/spinner";
import { ScrollArea } from "../ui/scroll-area";
import { formatDate, isSameYear, isToday } from "date-fns";
import { Textarea } from "../ui/textarea";

const DEFAULT_TAKE = 30;

export default function DashboardChatBox() {
    const { user } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const { data, isLoading } = useFetch<TSupportChatMessagesResponse>({
        endpoint: QueryKey.SUPPORT_CHAT_MESSAGES,
        queryKey: [QueryKey.SUPPORT_CHAT_MESSAGES],
        options: {
            enabled: (!!user && user?.role !== Role.SUPER_ADMIN && isChatOpen)
        },
        queryString: createQueryString({
            take: DEFAULT_TAKE,
        })
    });

    if (!user || user?.role === Role.SUPER_ADMIN) return null; // this is not for super admin

    return (
        <>
            <Activity mode={isChatOpen ? "hidden" : "visible"}>
                <div className="bg-slate-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    <p className="text-xs text-slate-400 mb-2">Support Chat</p>
                    <p className="text-sm font-medium mb-4">Start a conversation with our support team!</p>
                    <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => setIsChatOpen(true)}>Open Chat</Button>
                </div>
            </Activity>

            <Activity mode={isChatOpen ? "visible" : "hidden"}>
                <div className="fixed bottom-6 right-6 w-[500px] shadow-2xl flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <h3 className="font-semibold">Support Chat</h3>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="hover:bg-blue-700 rounded p-1 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <RenderMessages initialMessages={data?.data.toReversed() || []} user={user} isLoading={isLoading} />

                </div>
            </Activity>
        </>

    )
}

function RenderMessages({
    initialMessages,
    user,
    isLoading
}: {
    initialMessages: TSupportChatMessage[]
    user: NonNullable<TCurrentUser>
    isLoading: boolean
}) {
    const [messages, setMessages] = useState<TSupportChatMessage[]>(initialMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm<TSupportChatSchema>({
        resolver: zodResolver(supportChatSchema),
        defaultValues: supportChatDefaultValues,
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
                seenAt: null,
            }
        ]);

        form.reset({
            ...supportChatDefaultValues,
            supportChatId: data.supportChatId,
        });

        send(data);
        textareaRef.current?.focus();
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages])

    return (
        <>
            <div className="flex-1 overflow-y-auto bg-card">
                <ScrollArea className="h-[calc(100vh-24px)] max-h-[500px] p-4">
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
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender.id === user.accountId
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-secondary'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            <div className="p-4 bg-card border-t">
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
            </div>
        </>
    )
}