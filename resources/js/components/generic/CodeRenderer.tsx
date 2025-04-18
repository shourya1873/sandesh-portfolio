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

            if (domNode.name === 'h3') {
                return (
                    <h3 className={'text-2xl font-bold mt-4'}> {domToReact(domNode.children)} </h3>
                );
            }

            if (domNode.type === 'tag' && domNode.name === 'ul') {
                return (
                    <ul className="list-disc list-inside pl-4 mb-2">
                        {domToReact(domNode.children, options)} {/* 👈 pass options here */}
                    </ul>
                );
            }

            if (domNode.type === 'tag' && domNode.name === 'li') {
                return (
                    <li className="mb-1 pl-2">
                        {domToReact(domNode.children, options)} {/* 👈 recursive */}
                    </li>
                );
            }

            if (domNode.name === 'blockquote') {
                return (
                    <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 my-4">
                        {domToReact(domNode.children)}
                    </blockquote>
                );
            }

            if (domNode.name === 'h2') {
                return (
                    <h2 className={'text-3xl font-bold mt-4'}> {domToReact(domNode.children)} </h2>
                );
            }

            if (domNode.name === 'p') {
                return (
                    <p className={'text-lg mt-2'}> {domToReact(domNode.children)} </p>
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
        }
    };

    return (
        <div className="prose prose-lg prose-invert max-w-4xl mx-auto px-4 lg:px-0">
            {parse(html, options)}
        </div>
    );
};

export default CodeRenderer;
