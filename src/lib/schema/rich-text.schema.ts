import { SerializedEditorState } from "lexical";
import { z } from "zod";

export const richTextSchema = z.object({
    json: z.any(),
    html: z.string(),
});

export type IRichTextSchema = z.infer<typeof richTextSchema>;

export const richTextDefaultValues: IRichTextSchema = {
    json: {
        root: {
            children: [
                {
                    children: [],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
        },
    } as unknown as SerializedEditorState,
    html: "",
} 