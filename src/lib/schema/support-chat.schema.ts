import z from "zod";

export const supportChatSchema = z.object({
    content: z.string().min(1, "Message is required").max(500, "Message must be at most 500 characters long").transform((value) => value.trim()),
    supportChatId: z.string().uuid().optional(),
});

export type TSupportChatSchema = z.infer<typeof supportChatSchema>;

export const supportChatDefaultValues: TSupportChatSchema = {
    content: "",
    supportChatId: undefined,
};
