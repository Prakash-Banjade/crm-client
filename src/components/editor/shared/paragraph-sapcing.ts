import { createCommand } from "lexical";

export type ParagraphSpacing = "tight" | "normal" | "loose";

export const SET_PARAGRAPH_SPACING =
    createCommand<{ spacing: ParagraphSpacing }>("SET_PARAGRAPH_SPACING");
