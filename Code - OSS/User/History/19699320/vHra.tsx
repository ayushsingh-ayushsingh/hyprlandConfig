import {
    useRef,
    useState,
    useEffect,
    useCallback,
    type JSX,
    type FC, // Import FC for defining a Functional Component
} from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from 'rehype-sanitize';
import mermaid from 'mermaid';
import katex from 'katex';
import 'katex/dist/katex.css';
import type { Element } from 'hast';
// Correctly import CodeProps from react-markdown
import type { CodeProps } from 'react-markdown/lib/ast-to-react';

// Generate unique IDs for mermaid elements
const randomId = (): string =>
    parseInt(String(Math.random() * 1e15), 10).toString(36);

// Use the official CodeProps type from react-markdown for perfect compatibility.
const Code: FC<CodeProps> = ({ inline, className, children, ...props }) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const match = /language-(\w+)/.exec(className || '');
    const isMermaid = match && match[1] === 'mermaid';
    const isKaTeX = match && match[1] === 'katex';

    // react-markdown passes children as an array, so we flatten it to a string.
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
            const html = katex.renderToString(rawCode, { throwOnError: false });
            return <span dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (err: any) {
            return <code style={{ color: 'red' }}>{err.message}</code>;
        }
    }

    // Handle block-level KaTeX (e.g., $$...$$) which isn't a fenced code block
    if (!inline && typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
        const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
            throwOnError: false,
        });
        // Use a div for block display to avoid inline code styling
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Standard code block/inline code rendering
    return !inline ? (
        <code className={className} {...props}>
            {children}
        </code>
    ) : (
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
                // Correctly type the parameters for the rehypeRewrite function
                rehypeRewrite={(node: Element, _index: number, parent: Element) => {
                    if (
                        node.tagName === 'a' &&
                        parent &&
                        parent.type === 'element' &&
                        /^h[1-6]$/.test(parent.tagName)
                    ) {
                        // Keep the text content, remove the anchor link wrapper
                        if (parent.children && parent.children[0].type === 'element') {
                            parent.children = (parent.children[0] as Element).children;
                        }
                    }
                }}
                components={{
                    // This is now type-safe because the 'Code' component's signature is correct
                    code: Code,
                }}
            />
        </div>
    );
};