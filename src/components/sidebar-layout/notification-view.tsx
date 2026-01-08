import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Bell, FileUser, MessageCircle, MessageSquarePlus, UserPlus } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '@/lib/axios-client';
import { useRouter } from 'next/navigation';
import { ENotificationType, NotificationResponse, TNotification } from '@/lib/types/notification.type';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { useNotificationStream } from '@/hooks/useNotificationStream';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

export default function NotificationBellIcon() {
    const { data } = useFetch<{ totalCount: number, unreadCount: number }>({
        endpoint: `${QueryKey.NOTIFICATIONS}/counts`,
        queryKey: [`${QueryKey.NOTIFICATIONS}`, 'counts'],
    });

    // Activate the stream
    useNotificationStream();

    const unreadCount = data?.unreadCount ?? 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='ml-auto outline-none' asChild>
                <div className="relative cursor-pointer">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                    >
                        <Bell className="size-5" />
                    </Button>

                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-[8px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-background">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>

            {/* Added preventDefault on Close to avoid interaction conflicts */}
            <DropdownMenuContent align="end" className="w-[400px] p-0">
                <ScrollArea className='h-[600px]'>
                    <NotificationsList />
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const getNotificationIcon = (type: ENotificationType) => {
    switch (type) {
        case ENotificationType.APPLICATION_SUBMITTED: return <FileUser className="size-5 text-primary" />;
        case ENotificationType.STUDENT_CREATED: return <UserPlus className="size-5 text-blue-500" />;
        case ENotificationType.CONVERSATION: return <MessageSquarePlus className="size-5 text-green-500" />;
        case ENotificationType.SUPPORT_CHAT_MESSAGE: return <MessageCircle className="size-5 text-cyan-500" />;
        default: return <Bell className="size-5 text-gray-500" />;
    }
};

export function NotificationsList() {
    const queryClient = useQueryClient();
    const axios = useAxios();
    const router = useRouter();

    const { data, isLoading } = useFetch<NotificationResponse>({
        endpoint: `${QueryKey.NOTIFICATIONS}`,
        queryKey: [QueryKey.NOTIFICATIONS]
    });

    const { mutate: markAsSeenMutate } = useMutation({
        mutationFn: async (id: string) => {
            return await axios.patch(`${QueryKey.NOTIFICATIONS}/${id}/seen`);
        },
        onSuccess: () => {
            // Update counts immediately after success
            queryClient.invalidateQueries({ queryKey: [`${QueryKey.NOTIFICATIONS}`, 'counts'] });
            queryClient.invalidateQueries({ queryKey: [QueryKey.NOTIFICATIONS] });
        }
    });

    const handleNotificationClick = (n: TNotification) => {
        // // Optimistic Navigation: Navigate immediately
        // router.push(n.url);

        // Mark as seen in background only if not already seen
        if (!n.seenAt) {
            markAsSeenMutate(n.id);
        }
    };

    if (isLoading) return <div className="p-4 text-center text-sm">Loading...</div>;

    if (!data?.data?.length) {
        return <div className='text-sm text-muted-foreground text-center py-6'>No notifications</div>;
    }

    return (
        <div className="flex flex-col py-2">
            {data.data.map((n) => (
                <DropdownMenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                        "flex items-start gap-4 p-3 mx-2 rounded-lg transition-colors hover:bg-accent cursor-pointer",
                        n.seenAt ? "opacity-60" : "bg-muted/30 font-medium"
                    )}
                    asChild
                >
                    <Link href={n.url} onClick={() => handleNotificationClick(n)}>
                        <div className="shrink-0 mt-1">
                            {getNotificationIcon(n.type)}
                        </div>
                        <div className="grow space-y-1">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-sm leading-snug text-foreground">
                                    {n.title}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {n.description}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                                {formatDate(new Date(n.date), 'dd MMM yyyy, h:mm a')}
                            </p>
                        </div>
                        {/* Visual indicator for unread */}
                        {!n.seenAt && (
                            <span className="size-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                        )}
                    </Link>
                </DropdownMenuItem>
            ))}
        </div>
    );
}
