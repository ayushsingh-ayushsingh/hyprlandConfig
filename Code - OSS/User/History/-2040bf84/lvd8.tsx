import { useState } from 'preact/hooks'
import { Button } from "@/components/ui/button"
// import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1>Count: {count}</h1>
        <Button onClick={() => {
          setCount(count + 1)
        }}>Click me</Button>
      </div>
      {/* <MarkdownRenderer>
        {`# Hello World`}
      </MarkdownRenderer> */}
    </>
  )
}
