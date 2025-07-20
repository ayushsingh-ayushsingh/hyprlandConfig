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
import type { Components, ExtraProps } from 'react-markdown';

// Define the props for our custom code component
type CodeProps = JSX.IntrinsicElements['code'] & ExtraProps & {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
};

// Generate unique IDs for mermaid elements
const randomId = (): string =>
    parseInt(String(Math.random() * 1e15), 10).toString(36);

const Code: Components['code'] = ({ inline = false, className = '', children }: CodeProps) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const isMermaid = className?.toLowerCase().includes('language-mermaid');
    const isKaTeX = className?.toLowerCase().includes('language-katex');

    const rawCode = Array.isArray(children)
        ? children.map(String).join('')
        : String(children);

    useEffect(() => {
        const renderMermaid = async () => {
            if (container && isMermaid) {
                try {
                    const { svg } = await mermaid.render(id.current, rawCode);
                    container.innerHTML = svg;
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        container.innerHTML = `<pre style="color: red">${err.message}</pre>`;
                    }
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
                output: 'html',
            });
            return <code dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return <code style={{ color: 'red' }}>{err.message}</code>
            }
            return <code>Error rendering KaTeX</code>
        }
    }

    if (!inline && /^\$\$(.*)\$\$/.test(rawCode)) {
        try {
            const html = katex.renderToString(
                rawCode.replace(/^\$\$(.*)\$\$/, '$1'),
                {
                    throwOnError: false,
                    output: 'html',
                }
            );
            return <code dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return <code style={{ color: 'red' }}>{err.message}</code>
            }
            return <code>Error rendering KaTeX block</code>
        }
    }

    return <code className={className}>{children}</code>;
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
                rehypeRewrite={(
                    node: Element | Root,
                    _index: number,
                    parent: Root | Element | null
                ) => {
                    // Remove anchor links from headings
                    if (
                        node.type === 'element' &&
                        node.tagName === 'a' &&
                        parent?.type === 'element' &&
                        typeof parent.tagName === 'string' &&
                        /^h[1-6]$/.test(parent.tagName)
                    ) {
                        parent.children = parent.children.slice(1);
                    }
                }}
                components={{
                    code: Code,
                }}
            />
        </div>
    );
};