import { TMeta } from ".";

export enum ENotificationType {
    APPLICATION_SUBMITTED = 'application_submitted',
    STUDENT_CREATED = 'student_created',
    APPLICATION_STATUS_MODIFIED = 'application_status_modified',
    CONVERSATION = 'conversation',
    SUPPORT_CHAT_MESSAGE = 'support_chat_message'
}

export interface TNotification {
    id: string;
    type: ENotificationType;
    title: string;
    description: string;
    url: string;
    seenAt: string | null;
    date: string;
}

export interface NotificationResponse {
    data: TNotification[];
    meta: TMeta;
}