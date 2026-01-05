import { useEffect } from 'react'
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Bell, MessageSquarePlus, UserPlus } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useAxios } from '@/lib/axios-client';
import { useRouter } from 'next/navigation';
import { ENotificationType, NotificationResponse } from '@/lib/types/notification.type';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';

export const POLLING_INERVAL = 1 * 60 * 1000; // 1 minute

const getNotificationIcon = (type: ENotificationType) => {
    switch (type) {
        case ENotificationType.STUDENT_CREATED:
            return <UserPlus />;
        case ENotificationType.CONVERSATION:
            return <MessageSquarePlus />;
        default:
            return <Bell />;
    }
};

export default function NotificationBellIcon() {
    const { data, refetch } = useFetch<{ totalCount: number, unreadCount: number }>({
        endpoint: `${QueryKey.NOTIFICATIONS}/counts`,
        queryKey: [`${QueryKey.NOTIFICATIONS}`, 'counts']
    });

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            refetch();
        }, POLLING_INERVAL);

        return () => clearInterval(pollingInterval);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='ml-auto' asChild>
                <div className="relative cursor-pointer">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                    >
                        <Bell className="size-5" />
                    </Button>
                    {(data?.unreadCount ?? 0) > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs size-4 flex items-center justify-center">
                            {data?.unreadCount}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] max-h-[500px] overflow-y-auto">
                <NotificationsList />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function NotificationsList() {
    const queryClient = useQueryClient();
    const axios = useAxios();
    const router = useRouter()

    const { data, isLoading } = useFetch<NotificationResponse>({
        endpoint: `${QueryKey.NOTIFICATIONS}`,
        queryKey: [QueryKey.NOTIFICATIONS]
    });

    async function markAsSeen(id: string, url: string) {
        router.push(url);

        const res = await axios.patch(`${QueryKey.NOTIFICATIONS}/${id}/seen`)

        if (res.status === 200) {
            queryClient.invalidateQueries({
                queryKey: [`${QueryKey.NOTIFICATIONS}`, 'counts']
            });
            queryClient.invalidateQueries({
                queryKey: [`${QueryKey.NOTIFICATIONS}`]
            });
        }
    }

    if (isLoading) return <div>loading ...</div>;

    if (!data || !data.data.length) return <div className='text-sm text-muted-foreground text-center py-6'>No notifications</div>

    return (
        <div className="space-y-2">
            {
                data?.data?.map((n) => (
                    <DropdownMenuItem
                        key={n.id}
                        onClick={() => markAsSeen(n.id, n.url)}
                        className={cn(
                            `cursor-pointer flex items-start gap-4 p-3 rounded-lg`,
                            n.seenAt ? "opacity-50" : "font-semibold"
                        )}
                    >
                        <div className="shrink-0">{getNotificationIcon(n.type)}</div>
                        <div className="grow -mt-0.5 space-y-1">
                            <p className="text-sm">{n.title}</p>
                            <p className="text-xs text-muted-foreground! font-normal">{n.description}</p>
                            <p className="text-xs font-medium">{formatDate(n.date, 'dd MMM yyyy, h:mm a')}</p>
                        </div>
                    </DropdownMenuItem>
                ))
            }
        </div>
    )
}
