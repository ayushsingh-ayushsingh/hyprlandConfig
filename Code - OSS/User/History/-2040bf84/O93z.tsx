import { useEffect, useState } from 'preact/hooks'
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { ThemeProvider } from "@/components/theme-provider"

import { Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
      <ModeToggle />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-svh flex-col items-center justify-center">
          <h1>Count: {count}</h1>
          <Button onClick={() => {
            setCount(count + 1)
          }}>Click me</Button>
          <MarkdownRenderer>
            {markdownText}
          </MarkdownRenderer>
        </div>
      </ThemeProvider>
    </>
  )
}
