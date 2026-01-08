import { $applyNodeReplacement, LexicalNode } from "lexical";
import { LineHeightNode } from "../nodes/line-height-node";

export function $createLineHeightNode(style: string): LineHeightNode {
    return $applyNodeReplacement(new LineHeightNode(style));
}

export function $isLineHeightNode(node: LexicalNode | null | undefined): node is LineHeightNode {
    return node instanceof LineHeightNode;
}
