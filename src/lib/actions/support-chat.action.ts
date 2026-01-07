"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TSupportChatSchema } from "../schema/support-chat.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function sendSupportMessage(formData: TSupportChatSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: `/${QueryKey.SUPPORT_CHAT_MESSAGES}`,
        method: "POST",
    })
}