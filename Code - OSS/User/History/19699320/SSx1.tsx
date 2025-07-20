import {
    useRef,
    useState,
    useEffect,
    useCallback,
    type JSX,
} from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from 'rehype-sanitize';
import mermaid from 'mermaid';
import katex from 'katex';
import 'katex/dist/katex.css';
import type { Element, Root } from 'hast';
// Import Components from the main 'react-markdown' module
import type { Components } from 'react-markdown';

// Generate unique IDs for mermaid elements
const randomId = (): string =>
    parseInt(String(Math.random() * 1e15), 10).toString(36);

// Define the component using the official 'Components' type from react-markdown.
// This is the correct way to type custom components.
const Code: Components['code'] = ({ inline, className, children, ...props }) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const match = /language-(\w+)/.exec(className || '');
    const isMermaid = !inline && match && match[1] === 'mermaid';
    const isKaTeX = !inline && match && match[1] === 'katex';

    // Safely convert children to a string, trimming the trailing newline.
    const rawCode = String(children).replace(/\n$/, '');

    useEffect(() => {
        const renderMermaid = async () => {
            if (container && isMermaid) {
                try {
                    const { svg } = await mermaid.render(id.current, rawCode);
                    container.innerHTML = svg;
                } catch (err: any) {
                    container.innerHTML = `<pre style="color: red;">${err.message}</pre>`;
                }
            }
        };
        renderMermaid();
    }, [container, isMermaid, rawCode]);

    const refElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    if (isMermaid) {
        return (
            <>
                <code id={id.current} style={{ display: 'none' }} />
                <div ref={refElement} data-name="mermaid" />
            </>
        );
    }

    if (isKaTeX) {
        try {
            const html = katex.renderToString(rawCode, {
                throwOnError: false,
                displayMode: true, // Render as a block element
            });
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (err: any) {
            return <code style={{ color: 'red' }}>{err.message}</code>;
        }
    }

    if (!inline && typeof rawCode === 'string' && /^\$\$(.*)\$\$/.test(rawCode)) {
        const html = katex.renderToString(rawCode.replace(/^\$\$(.*)\$\$/, '$1'), {
            throwOnError: false,
            displayMode: true,
        });
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    
    // Standard inline or fenced code block
    return (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

// Main Renderer Function
export const renderMarkdown = (markdownText: string): JSX.Element => {
    return (
        <div className="wmde-markdown-var">
            <MarkdownPreview
                source={markdownText}
                style={{ padding: 16 }}
                wrapperElement={{ 'data-color-mode': 'dark' }} // change to 'light' if needed
                rehypePlugins={[rehypeSanitize]}
                // Use a more robust type signature for the rewrite function
                rehypeRewrite={(node: Element | Root, _index, parent) => {
                    // Remove anchor links from headings (added by plugins like rehype-slug)
                    if (
                        node.type === 'element' &&
                        node.tagName === 'a' &&
                        parent?.type === 'element' &&
                        typeof parent.tagName === 'string' &&
                        /^h[1-6]$/.test(parent.tagName)
                    ) {
                        // This logic assumes a structure like <h1><a ...></a> text</h1>
                        // and removes the anchor link.
                        parent.children = parent.children.slice(1);
                    }
                }}
                components={{
                    // This is now fully type-safe.
                    code: Code,
                }}
            />
        </div>
    );
};```