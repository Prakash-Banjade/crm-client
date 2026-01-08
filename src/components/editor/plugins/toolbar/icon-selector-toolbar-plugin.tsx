import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { IconSelector } from "../../editor-ui/icon-selector";
import { INSERT_ICON_COMMAND } from "../picker/icon-picker/icon-commands";

export function IconSelectorToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    return (
        <IconSelector onSelect={(name) => editor.dispatchCommand(INSERT_ICON_COMMAND, name)} />
    );
}
