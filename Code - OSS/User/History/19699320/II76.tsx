import React, {
    useRef,
    useState,
    useEffect,
    Fragment,
    useCallback,
    type JSX,
} from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize from 'rehype-sanitize';
import mermaid from 'mermaid';
import katex from 'katex';
import 'katex/dist/katex.css';
import type { Components } from 'react-markdown';
import type { Element } from 'hast';

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
const Code: React.FC<CodeProps> = ({
    inline = false,
    children = [],
    className = '',
    ...props
}) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const isMermaid = className.toLowerCase().includes('language-mermaid');
    const isKaTeX = className.toLowerCase().includes('language-katex');
    let rawCode = '';

    if (props.node?.children) {
        rawCode = getCodeString(props.node.children);
    } else if (Array.isArray(children) && typeof children[0] === 'string') {
        rawCode = children[0];
    } else if (typeof children === 'string') {
        rawCode = children;
    }


    // Render Mermaid chart
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container, isMermaid, rawCode]);

    const refElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) setContainer(node);
    }, []);

    if (isMermaid) {
        return (
            <Fragment>
                <code id={id.current} style={{ display: 'none' }} />
                <div ref={refElement} data-name="mermaid" />
            </Fragment>
        );
    }


    if (typeof rawCode === 'string' && isKaTeX) {
        const html = katex.renderToString(rawCode, { throwOnError: false });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (
        !inline &&
        typeof children === 'string' &&
        /^\$\$(.*)\$\$/.test(children)
    ) {
        const html = katex.renderToString(
            children.replace(/^\$\$(.*)\$\$/, '$1'),
            { throwOnError: false }
        );
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return <code className={String(className)}>{children}</code>;
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
                    code: Code as Components['code'],
                }}
            />
        </div>
    );
};
