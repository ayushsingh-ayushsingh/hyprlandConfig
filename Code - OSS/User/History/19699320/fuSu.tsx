import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdown = `Just a link: www.nasa.gov.`

createRoot(document.body).render(
  <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
)