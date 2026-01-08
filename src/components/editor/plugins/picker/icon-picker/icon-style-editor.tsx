import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { UPDATE_ICON_STYLE_COMMAND } from "./icon-commands";
import { useEffect, useState } from "react";
import { $isIconNode, IconNodeJSON } from "@/components/editor/nodes/icon-node";
import { $getNodeByKey } from "lexical";
import ColorPicker from "@/components/editor/editor-ui/colorpicker";
import { BaselineIcon, PaintBucketIcon, SquareDashedTopSolid } from "lucide-react";

export function IconStyleEditor({ nodeKey }: { nodeKey: string }) {
    const [editor] = useLexicalComposerContext();
    const [attrs, setAttrs] = useState<Omit<IconNodeJSON, "type" | "version"> | null>(null);

    useEffect(() => {
        const readAttrs = () => {
            editor.getEditorState().read(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isIconNode(node)) setAttrs(node.getAttributes());
            });
        };

        // initial read
        readAttrs();

        // keep in sync with editor updates
        return editor.registerUpdateListener(() => {
            readAttrs();
        });
    }, [editor, nodeKey]);

    const send = (patch: Partial<Omit<IconNodeJSON, "type" | "version">>) => {
        editor.dispatchCommand(UPDATE_ICON_STYLE_COMMAND, { nodeKey, ...patch });
    };

    if (!attrs) return null;

    return (
        <>
            <fieldset className="border border-input rounded-md h-8 flex items-center">
                <legend className="text-[10px] mx-1 leading-0">Size</legend>
                <input
                    type="number"
                    className="w-[7ch] focus-visible:outline-0 px-1 text-center"
                    autoComplete="off"
                    defaultValue={attrs.size}
                    onChange={(e) => send({ size: +e.target.value })}
                />
            </fieldset>
            <fieldset className="border border-input rounded-md h-8 flex items-center">
                <legend className="text-[10px] mx-1 leading-0">Padding</legend>
                <input
                    type="number"
                    className="w-[7ch] focus-visible:outline-0 px-1 text-center"
                    autoComplete="off"
                    defaultValue={attrs.padding || 0}
                    onChange={(e) => send({ padding: +e.target.value })}
                />
            </fieldset>
            <fieldset className="border border-input rounded-md h-8 flex items-center">
                <legend className="text-[10px] mx-1 leading-0">Radius</legend>
                <input
                    type="number"
                    className="w-[7ch] focus-visible:outline-0 px-1 text-center"
                    autoComplete="off"
                    defaultValue={attrs.radius || 0}
                    onChange={(e) => send({ radius: +e.target.value })}
                />
            </fieldset>
            <ColorPicker
                color={attrs.color}
                icon={<BaselineIcon className="size-4" />}
                onChange={(color) => send({ color })}
                title={"Icon Color"}
            />
            <ColorPicker
                color={attrs.background}
                icon={<PaintBucketIcon className="size-4" />}
                onChange={(color) => send({ background: color })}
                title={"Background Color"}
            />
            <ColorPicker
                color={attrs.borderColor}
                icon={<SquareDashedTopSolid className="size-4" />}
                onChange={(color) => send({ borderColor: color })}
                title={"Border Color"}
            />
            <fieldset className="border border-input rounded-md h-8 flex items-center">
                <legend className="text-[10px] mx-1 leading-0">Border Width</legend>
                <input
                    type="number"
                    className="w-[7ch] focus-visible:outline-0 px-1 text-center"
                    autoComplete="off"
                    defaultValue={attrs.borderWidth || 0}
                    onChange={(e) => send({ borderWidth: +e.target.value })}
                />
            </fieldset>
        </>
    );
}
