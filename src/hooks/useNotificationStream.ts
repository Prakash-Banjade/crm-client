import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/context/auth-provider';

export const useNotificationStream = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) return;

        // 1. Initialize EventSource
        // Note: Native EventSource doesn't support custom headers (Authorization).
        // If your backend requires a header, you might need 'event-source-polyfill'
        // OR pass the token in the query string: /notifications/stream?token=...
        const url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/stream?token=${accessToken}`;

        const eventSource = new EventSource(url);

        // 2. Handle incoming messages
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // // OPTION A: Simply refetch everything (Easiest)
            // queryClient.invalidateQueries({ queryKey: [QueryKey.NOTIFICATIONS] });

            // // OPTION B: Optimistic Update (Better UX)
            // Update the unread count manually
            queryClient.setQueryData(
                [`${QueryKey.NOTIFICATIONS}`, 'counts'],
                (old: any) => ({
                    ...old,
                    unreadCount: (old?.unreadCount || 0) + 1,
                    totalCount: (old?.totalCount || 0) + 1
                })
            );

            // Add new notification to the top of the list
            queryClient.setQueryData(
                [QueryKey.NOTIFICATIONS],
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        data: [data.notification, ...(old.data || [])]
                    };
                }
            );
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
            // Optional: Implement custom reconnection logic if needed, 
            // though browser EventSource retries automatically by default.
        };

        // 3. Cleanup on unmount
        return () => {
            eventSource.close();
        };
    }, [queryClient, accessToken]);
};