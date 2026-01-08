import {
    ParagraphNode,
    LexicalNode,
    SerializedElementNode,
    SerializedParagraphNode,
    EditorConfig,
} from 'lexical';

export class LineHeightNode extends ParagraphNode {
    __style: string;

    static getType(): string {
        return 'styled-paragraph';
    }

    static clone(node: LineHeightNode): LineHeightNode {
        return new LineHeightNode(node.__style, node.__key);
    }

    constructor(style = '', key?: LexicalNode['__key']) {
        super(key);
        this.__style = style;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        if (this.__style) dom.style.cssText = this.__style;
        return dom;
    }

    updateDOM(prevNode: LineHeightNode, dom: HTMLElement, config: EditorConfig): boolean {
        const didBase = super.updateDOM(prevNode, dom, config);
        if (this.__style !== prevNode.__style) {
            dom.style.cssText = this.__style || '';
        }
        return didBase;
    }

    setStyle(style: string): this {
        const writable = this.getWritable();
        writable.__style = style;
        return writable;
    }

    getStyle(): string {
        return this.getLatest().__style;
    }

    static importJSON(serialized: SerializedElementNode & { style?: string }) {
        const node = new LineHeightNode(serialized.style || '');
        node.setFormat(serialized.format);
        node.setIndent(serialized.indent);
        return node;
    }

    exportJSON(): SerializedParagraphNode & { style?: string } {
        const json = super.exportJSON() as SerializedParagraphNode & { style?: string };
        const style = this.getStyle();
        if (style) json.style = style;
        return json;
    }
}
