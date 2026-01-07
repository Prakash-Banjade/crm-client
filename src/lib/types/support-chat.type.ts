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
}

export type TSupportChatResponse = PaginatedResponse<TSupportChat>;