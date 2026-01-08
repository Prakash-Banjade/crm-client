"use client"

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"
import { $generateHtmlFromNodes } from '@lexical/html';

import { FloatingLinkContext } from "../../context/floating-link-context"
import { SharedAutocompleteContext } from "../../context/shared-autocomplete-context"
import { editorTheme } from "../../themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { EditorPluginProps, Plugins } from "./plugins"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

type EditorProps = {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (value: { json: SerializedEditorState, html: string }) => void
} & EditorPluginProps

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  ...editorPluginProps
}: EditorProps) {
  return (
    <div className="rich_text bg-background overflow-hidden">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <Plugins {...editorPluginProps} />

              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState, editor) => {
                  editorState.read(() => {
                    const json = editorState.toJSON();
                    const html = $generateHtmlFromNodes(editor, null);
                    onChange?.(editorState)
                    onSerializedChange?.({ json, html })
                  });
                }}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
