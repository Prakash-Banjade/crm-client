import { $createIconNode, $isIconNode } from "@/components/editor/nodes/icon-node";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, $getNodeByKey } from "lexical";
import { INSERT_ICON_COMMAND, UPDATE_ICON_STYLE_COMMAND } from "./icon-commands";

export function IconPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  editor.registerCommand(
    INSERT_ICON_COMMAND,
    (iconName: string) => {
      const node = $createIconNode(iconName);
      $insertNodes([node]);
      return true;
    },
    0
  );

  editor.registerCommand(
    UPDATE_ICON_STYLE_COMMAND,
    (payload) => {
      editor.update(() => {
        const node = $getNodeByKey(payload.nodeKey);
        if ($isIconNode(node)) {
          node.setAttributes({
            size: payload.size,
            color: payload.color,
            background: payload.background,
            padding: payload.padding,
            radius: payload.radius,
            borderColor: payload.borderColor,
            borderWidth: payload.borderWidth,
          });
        }
      });
      return true;
    },
    0
  );

  return null;
}
