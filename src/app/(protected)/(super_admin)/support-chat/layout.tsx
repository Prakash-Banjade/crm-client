"use client";

import SupportChatLayout from "@/components/support-chat/support-chat-layout";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SupportChatLayout>
            {children}
        </SupportChatLayout>
    )
}