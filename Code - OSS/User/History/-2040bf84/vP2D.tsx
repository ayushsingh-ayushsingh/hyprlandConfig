import { useState } from 'preact/hooks'
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"


export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Count: {count}</h1>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button onClick={() => {
          setCount(count + 1)
        }}>Click me</Button>
        <MarkdownRenderer>
          {`# Hello World
 
This is a paragraph with **bold** and *italic* text.
 
## Lists
- Item 1
- Item 2
  - Nested item
 
## Code
\`\`\`tsx
console.log("Hello World")
\`\`\`
 
## Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`}
        </MarkdownRenderer>
      </div>
    </>
  )
}
