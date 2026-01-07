import { PaginatedResponse, Role } from "."

export type TSupportChatMessage = {
    id: string,
    content: string,
    createdAt: string,
    sender: {
        id: string,
        lowerCasedFullName: string,
        role: Role
    }
    seenAt: string | null;
}

export type TSupportChatMessagesResponse = PaginatedResponse<TSupportChatMessage>;

export type TSupportChat = {
    id: string
    latestMessageContent: string
    latestMessageCreatedAt: string
    organizationId: string
    organizationName: string;
    sender: string;
    senderId: string;
    senderRole: Role
    latestMessageSeenAt: string | null;
}

export type TSupportChatResponse = PaginatedResponse<TSupportChat>;

export type TSingleSupportChat = {
    id: string;
    account: {
        id: true,
        lowerCasedFullName: string;
        role: Role
        organization: {
            id: true,
            name: string
        }
    }
}