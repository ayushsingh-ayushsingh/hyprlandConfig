import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(Number(localStorage.getItem("count")) || 0);
  localStorage.setItem("count", count.toString());

  return (
    <>
      <h1>Ayush Singh</h1>
      <h1>Count: {count}</h1>
      <button onClick={() => {
        setCount(count + 1);
      }}>
        Click
      </button>
    </>
  )
}
