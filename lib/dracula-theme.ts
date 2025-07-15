import type { PrismTheme } from "prism-react-renderer"

/**
 * A minimal ES-module copy of the Prism “Dracula” theme.
 * You can freely tweak the colours to match your palette.
 */
export const draculaTheme: PrismTheme = {
  plain: {
    backgroundColor: "#282a36",
    color: "#f8f8f2",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6272a4" } },
    { types: ["punctuation"], style: { color: "#f8f8f2" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#bd93f9" } },
    { types: ["attr-name", "string", "char", "builtin", "inserted"], style: { color: "#f1fa8c" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#ff79c6" } },
    { types: ["keyword"], style: { color: "#8be9fd" } },
    { types: ["atrule", "class-name", "function"], style: { color: "#50fa7b" } },
    { types: ["deleted"], style: { color: "#ff5555" } },
    { types: ["regex"], style: { color: "#ffb86c" } },
  ],
}
