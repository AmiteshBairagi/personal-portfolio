"use client"

import { Highlight, type Language } from "prism-react-renderer"
import { draculaTheme } from "@/lib/dracula-theme"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <Highlight code={code.trimEnd()} language={language as Language} theme={draculaTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            className,
            "my-6 overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 text-sm shadow-lg",
          )}
          style={style}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i })
            const { key: _ignoredLineKey, ...cleanLineProps } = lineProps

            return (
              <div key={i} {...cleanLineProps}>
                <span className="select-none pr-4 text-slate-600">{i + 1}</span>

                {line.map((token, j) => {
                  const tokenProps = getTokenProps({ token, key: j })
                  const { key: _ignoredTokenKey, ...cleanTokenProps } = tokenProps

                  return <span key={j} {...cleanTokenProps} />
                })}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}
