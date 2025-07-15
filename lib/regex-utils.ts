// /**
//  * Escape all characters that have a special meaning inside regular-expressions
//  * so the resulting string can be embedded safely in `new RegExp(...)`.
//  *
//  *   const safe = escapeRegExp(userInput)
//  *   const re   = new RegExp(safe, "i")
//  */
// export function escapeRegExp(input: string): string {
//   // From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
//   return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
// }
