"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight } from "lowlight"
import type { RichTextJSON } from "@/server/db/schema"

const lowlight = createLowlight()

interface BlogRendererProps {
    content: RichTextJSON
}

export function BlogRenderer({ content }: BlogRendererProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Underline,
        ],
        content,
        editable: false,
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0">
            <EditorContent editor={editor} />
        </div>
    )
}

