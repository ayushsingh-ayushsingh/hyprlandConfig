// import { useEffect, useState } from 'preact/hooks'

// export function App() {
//   const [count, setCount] = useState(Number(localStorage.getItem("count")) || 0);

//   useEffect(() => {
//     localStorage.setItem("count", count.toString());
//   }, [count, setCount])

//   return (
//     <>
//       <div className="h-screen bg-green-400 text-2xl flex items-center justify-center gap-4">
//         <h1>Ayush Singh</h1>
//         <h1>Count: {count}</h1>
//         <button onClick={() => {
//           setCount(count + 1);
//         }}>
//           Click
//         </button>
//       </div>
//     </>
//   )
// }


import React from 'react';
import { renderMarkdown } from './renderMarkdown';

const markdown = `
## Welcome to MarkdownPreview ✨

### Features
- [x] Dark Mode
- [x] Code Highlight
- [x] Mermaid Support
- [x] Math (KaTeX)
- [x] GitHub Alerts
- [x] GFM Tables, Task Lists, Footnotes

\`\`\`js showLineNumbers {2}
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> [!TIP]
> You can render GitHub-style alerts too!

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`

\`\`\`katex
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

[^1]: This is a footnote.
`;

export default function App() {
  return renderMarkdown(markdown);
}
