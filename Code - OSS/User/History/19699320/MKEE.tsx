import React, {
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
import type { Element } from 'hast';
import type { CodeComponent } from 'react-markdown/lib/ast-to-react';

// Random ID generator for mermaid containers
const randomId = (): string =>
    parseInt(String(Math.random() * 1e15), 10).toString(36);

// Type for custom code component props
interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: {
        children?: any;
    };
}

// Custom code renderer to support Mermaid + KaTeX
const Code: CodeComponent = ({ inline = false, className = '', children }) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const isMermaid = className.toLowerCase().includes('language-mermaid');
    const isKaTeX = className.toLowerCase().includes('language-katex');

    const rawCode = Array.isArray(children) ? children.join('') : String(children);

    const renderMermaid = async () => {
        if (container && isMermaid) {
            try {
                const result = await mermaid.render(id.current, rawCode);
                container.innerHTML = result.svg;
            } catch (err: any) {
                container.innerHTML = `<pre style="color: red">${err.message}</pre>`;
            }
        }
    };

    useEffect(() => {
        renderMermaid();
    }, [container, isMermaid, rawCode]);

    const refElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) setContainer(node);
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
        const html = katex.renderToString(rawCode, { throwOnError: false });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (!inline && /^\$\$(.*)\$\$/.test(rawCode)) {
        const html = katex.renderToString(rawCode.replace(/^\$\$(.*)\$\$/, '$1'), {
            throwOnError: false,
        });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return <code className={className}>{children}</code>;
};

// Main render function
export const renderMarkdown = (markdownText: string): JSX.Element => {
    return (
        <div className="wmde-markdown-var">
            <MarkdownPreview
                source={markdownText}
                style={{ padding: 16 }}
                wrapperElement={{ 'data-color-mode': 'dark' }} // Change to 'light' if needed
                rehypePlugins={[rehypeSanitize]}
                rehypeRewrite={(node: Element, _index, parent) => {
                    // Disable header links
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
