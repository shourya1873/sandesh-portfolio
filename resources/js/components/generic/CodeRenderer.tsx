import React, { useEffect, useState } from 'react';
import parse, { domToReact } from 'html-react-parser';
import Prism from 'prismjs';
import toast from 'react-hot-toast';

import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // html

const CodeRenderer = ({ html }: { html: string }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [html]);

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (code: string, index: number) => {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                toast.success('Code copied!');
                setCopiedIndex(index);

                setTimeout(() => {
                    setCopiedIndex(null);
                }, 2000);
            });
        }
    };

    let codeBlockIndex = -1;

    const options = {
        replace: (domNode: any) => {
            // Custom rendering for images
            if (domNode.name === 'img') {
                return (
                    <img
                        src={domNode.attribs.src}
                        alt={domNode.attribs.alt || 'image'}
                        className="max-w-full h-auto rounded-lg shadow-md my-4"
                    />
                );
            }

            if(domNode.name === 'h3') {
                return (
                    <h3 className={'text-2xl font-bold'}> {domNode.children[0].data} </h3>
                );
            }

            if(domNode.name === 'h2') {
                return (
                    <h2 className={'text-3xl font-bold'}> {domNode.children[0].data} </h2>
                );
            }

            if(domNode.name === 'p') {
                return (
                    <p className={'text-lg'}> {domNode?.children[0]?.data} </p>
                );
            }

            // Custom rendering for code blocks
            if (domNode.name === 'pre') {
                codeBlockIndex += 1;
                const index = codeBlockIndex;
                const codeText = domNode.children[0].data;

                const isCopied = copiedIndex === index;

                return (
                    <div className="relative group my-6 bg-[#1e1e1e] text-white rounded-lg overflow-hidden shadow-md">
                        <button
                            className={`absolute top-2 right-2 z-10 text-xs px-3 py-1 rounded
              ${isCopied ? 'bg-green-600 cursor-default' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'}
              opacity-0 group-hover:opacity-100 transition-all duration-300`}
                            onClick={() => !isCopied && handleCopy(codeText, index)}
                            disabled={isCopied}
                        >
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <pre className="p-4 overflow-x-auto whitespace-pre-wrap break-words text-sm">
                            <code>{codeText}</code>
                        </pre>
                    </div>
                );
            }
        },
    };

    return (
        <div className="prose prose-lg prose-invert max-w-4xl mx-auto px-4 lg:px-0">
            {parse(html, options)}
        </div>
    );
};

export default CodeRenderer;
