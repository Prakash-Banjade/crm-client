import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isNodeSelection, $isRangeSelection, LexicalNode } from "lexical";
import { $isIconNode } from "../nodes/icon-node";

export function useActiveIconNode() {
    const [editor] = useLexicalComposerContext();
    const [activeIconKey, setActiveIconKey] = useState<string | null>(null);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if ($isNodeSelection(selection)) {
                    const icon = selection.getNodes().find((n: LexicalNode) => $isIconNode(n));
                    if (icon) {
                        setActiveIconKey(icon.getKey());
                        return;
                    }
                    // Node selection but not an icon -> clear
                    setActiveIconKey(null);
                    return;
                }

                if ($isRangeSelection(selection)) {
                    // Caret moved into text -> clear
                    setActiveIconKey(null);
                    return;
                }

                // selection == null (editor blurred): do NOT clear.
                // Keep the previously selected icon so popover stays open while user edits controls.
            });
        });
    }, [editor]);

    return activeIconKey; // null means no active icon
}
