import { useAuth } from '@/context/auth-provider';
import { useFetch } from '@/hooks/useFetch';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { TSupportChatMessage, TSupportChatMessagesResponse } from '@/lib/types/support-chat.type';

type Props = {}

export default function SupportChatMessages({ }: Props) {
    const { user } = useAuth();

    const { data, isLoading } = useFetch<TSupportChatMessagesResponse>({
        endpoint: QueryKey.SUPPORT_CHAT_MESSAGES,
        queryKey: [QueryKey.SUPPORT_CHAT_MESSAGES],
    });

    if (!user) return null;

    return (
        <></>
    )
}

