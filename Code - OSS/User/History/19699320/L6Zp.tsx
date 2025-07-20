import React, { useRef, useState, useEffect, Fragment, useCallback } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize from 'rehype-sanitize';
import mermaid from 'mermaid';
import katex from 'katex';
import 'katex/dist/katex.css';

// Random ID generator for mermaid containers
const randomId = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

// Custom code renderer to support Mermaid + KaTeX
const Code = ({ inline, children = [], className, ...props }) => {
    const id = useRef(`mermaid-${randomId()}`);
    const [container, setContainer] = useState(null);
    const isMermaid = className?.toLowerCase().includes('language-mermaid');
    const isKaTeX = className?.toLowerCase().includes('language-katex');
    const rawCode = props.node && props.node.children ? getCodeString(props.node.children) : children[0] || '';

    // Render Mermaid chart
    const renderMermaid = async () => {
        if (container && isMermaid) {
            try {
                const result = await mermaid.render(id.current, rawCode);
                container.innerHTML = result.svg;
            } catch (err) {
                container.innerHTML = `<pre style="color: red">${err.message}</pre>`;
            }
        }
    };

    useEffect(() => {
        renderMermaid();
    }, [container, isMermaid, rawCode]);

    const refElement = useCallback((node: React.SetStateAction<null>) => {
        if (node !== null) setContainer(node);
    }, []);

    // Render Mermaid
    if (isMermaid) {
        return (
            <Fragment>
                <code id={id.current} style={{ display: 'none' }} />
                <code ref={refElement} data-name="mermaid" />
            </Fragment>
        );
    }

    // Render KaTeX
    if (typeof rawCode === 'string' && isKaTeX) {
        const html = katex.renderToString(rawCode, { throwOnError: false });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Inline KaTeX: $$...$$
    if (!inline && typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
        const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
            throwOnError: false,
        });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return <code className={String(className)}>{children}</code>;
};

// Main render function
export const renderMarkdown = (markdownText: string) => {
    return (
        <div className="wmde-markdown-var">
            <MarkdownPreview
                source={markdownText}
                style={{ padding: 16 }}
                wrapperElement={{ 'data-color-mode': 'dark' }} // Change to 'light' if needed
                rehypePlugins={[rehypeSanitize]}
                rehypeRewrite={(node, index, parent) => {
                    // Disable header links
                    if (node.tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
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
