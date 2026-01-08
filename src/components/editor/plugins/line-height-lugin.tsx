import { $getSelection, $isParagraphNode, LexicalEditor } from 'lexical';
import { $createLineHeightNode, $isLineHeightNode } from '../utils/line-height';

export function applyLineHeight(editor: LexicalEditor, lineHeight: string) {
    editor.update(() => {
        const selection = $getSelection();
        if (!selection) return;
        const nodes = selection.getNodes();

        nodes.forEach((node) => {
            if ($isParagraphNode(node)) {
                let target = node;
                if (!$isLineHeightNode(node)) {
                    const newNode = $createLineHeightNode('');
                    newNode.append(...node.getChildren());
                    node.replace(newNode);
                    target = newNode;
                }
                target.setStyle(`line-height:${lineHeight}`);
            }
        });
    });
}
