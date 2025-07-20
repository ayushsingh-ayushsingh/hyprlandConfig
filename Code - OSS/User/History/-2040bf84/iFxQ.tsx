import { useEffect, useState } from 'preact/hooks'
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

export function App() {
  const [count, setCount] = useState(Number(localStorage.getItem("count")) || 0);

  const markdownText = `# Hello World
 
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
`

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count, setCount]);

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1>Count: {count}</h1>
        <Button onClick={() => {
          setCount(count + 1)
        }}>Click me</Button>
        <MarkdownRenderer>
          {markdownText}
        </MarkdownRenderer>
      </div>
    </>
  )
}
