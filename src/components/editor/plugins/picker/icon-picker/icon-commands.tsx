import { createCommand } from "lexical";

export const UPDATE_ICON_STYLE_COMMAND = createCommand<{
  nodeKey: string;                 // <-- target explicitly
  size?: number;
  color?: string;
  background?: string;
  padding?: number;
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
}>("UPDATE_ICON_STYLE_COMMAND");

export const INSERT_ICON_COMMAND = createCommand<string>("INSERT_ICON_COMMAND");
