import { DecoratorNode, DOMExportOutput, type NodeKey } from "lexical";
import * as LucideIcons from "lucide-react";
import React, { JSX } from "react";
import ReactDOMServer from "react-dom/server";

export interface IconNodeJSON {
    type: "icon";
    version: 1;
    iconName: string;
    size: number;
    color: string;
    background: string;
    padding: number;
    radius: number;
    borderColor: string;
    borderWidth: number;
}

export class IconNode extends DecoratorNode<JSX.Element> {
    __iconName: string;
    __size: number;
    __color: string;
    __background: string;
    __padding: number;
    __radius: number;
    __borderColor: string;
    __borderWidth: number;

    static getType() {
        return "icon";
    }

    static clone(node: IconNode) {
        return new IconNode(
            node.__iconName,
            node.__size,
            node.__color,
            node.__background,
            node.__padding,
            node.__radius,
            node.__borderColor,
            node.__borderWidth,
            node.__key
        );
    }

    constructor(
        iconName: string,
        size = 18,
        color = "var(--foreground)",
        background = "var(--background)",
        padding = 0,
        radius = 0,
        borderColor = "#000000",
        borderWidth = 0,
        key?: NodeKey
    ) {
        super(key);
        this.__iconName = iconName;
        this.__size = size;
        this.__color = color;
        this.__background = background;
        this.__padding = padding;
        this.__radius = radius;
        this.__borderColor = borderColor;
        this.__borderWidth = borderWidth;
    }

    createDOM(): HTMLElement {
        const span = document.createElement("span");
        span.className = "inline-flex items-center align-middle select-none";
        return span;
    }

    updateDOM(): boolean {
        return false;
    }

    decorate(): JSX.Element {
        const Icon = (LucideIcons as any)[this.__iconName];
        if (!Icon) return <span>[?]</span>;

        return (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: this.__background,
                    color: this.__color,
                    borderRadius: `${this.__radius}%`,
                    padding: `${this.__padding}px`,
                    lineHeight: 0,
                    verticalAlign: "middle",
                    border: `${this.__borderWidth}px solid ${this.__borderColor}`,
                }}
            >
                <Icon size={this.__size} />
            </span>
        );
    }

    exportJSON(): IconNodeJSON {
        return {
            type: "icon",
            version: 1,
            iconName: this.__iconName,
            size: this.__size,
            color: this.__color,
            background: this.__background,
            padding: this.__padding,
            radius: this.__radius,
            borderColor: this.__borderColor,
            borderWidth: this.__borderWidth,
        };
    }

    exportDOM(): DOMExportOutput {
        // Wrapper that carries all visual styles; Lucide icons use currentColor for stroke.
        const span = document.createElement("span");
        span.setAttribute("data-lexical-icon", this.__iconName);
        span.style.display = "inline-flex";
        span.style.alignItems = "center";
        span.style.justifyContent = "center";
        span.style.verticalAlign = "middle";
        span.style.lineHeight = "0";
        span.style.color = this.__color; // drives SVG stroke via currentColor
        span.style.background = this.__background;
        span.style.padding = `${this.__padding}px`;
        span.style.borderRadius = `${this.__radius}%`;
        if (this.__borderWidth > 0) {
            span.style.border = `${this.__borderWidth}px solid ${this.__borderColor}`;
        }

        const Icon = (LucideIcons as any)[this.__iconName];
        if (Icon) {
            // Render Lucide <svg> as a string and inject it so the HTML includes the icon.
            const svg = ReactDOMServer.renderToStaticMarkup(
                React.createElement(Icon, {
                    size: this.__size,
                    strokeWidth: 2, // or your stored stroke width if you add it
                })
            );
            span.innerHTML = svg;
        } else {
            span.textContent = "[?]";
        }

        return { element: span };
    }

    static importJSON(json: IconNodeJSON): IconNode {
        const {
            iconName,
            size,
            color,
            background,
            padding,
            radius,
            borderColor,
            borderWidth,
        } = json;
        return new IconNode(
            iconName,
            size,
            color,
            background,
            padding,
            radius,
            borderColor,
            borderWidth
        );
    }

    setAttributes(attrs: Partial<Omit<IconNodeJSON, "type" | "version">>) {
        const writable = this.getWritable();
        Object.assign(writable, {
            __iconName: attrs.iconName ?? writable.__iconName,
            __size: attrs.size ?? writable.__size,
            __color: attrs.color ?? writable.__color,
            __background: attrs.background ?? writable.__background,
            __padding: attrs.padding ?? writable.__padding,
            __radius: attrs.radius ?? writable.__radius,
            __borderColor: attrs.borderColor ?? writable.__borderColor,
            __borderWidth: attrs.borderWidth ?? writable.__borderWidth,
        });
    }

    getAttributes(): Omit<IconNodeJSON, "type" | "version"> {
        const n = this.getLatest();
        return {
            iconName: n.__iconName,
            size: n.__size,
            color: n.__color,
            background: n.__background,
            padding: n.__padding,
            radius: n.__radius,
            borderColor: n.__borderColor,
            borderWidth: n.__borderWidth,
        };
    }
}

export function $createIconNode(iconName: string): IconNode {
    return new IconNode(iconName);
}

export function $isIconNode(node?: unknown): node is IconNode {
    return node instanceof IconNode;
}
