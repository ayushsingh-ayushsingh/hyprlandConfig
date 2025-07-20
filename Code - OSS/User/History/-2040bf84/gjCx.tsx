// import { useState } from 'preact/hooks'
import { Button } from "@/components/ui/button"

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Count: {count}</h1>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </>
  )
}
