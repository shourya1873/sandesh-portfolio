"use client"

import { useMemo, useRef, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight } from "lowlight"
import clsx from "clsx"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Code2,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Link as LinkIcon,
    Undo,
    Redo,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type RichTextEditorProps = {
    value: Record<string, unknown>
    onChange: (value: Record<string, unknown>) => void
}

const lowlight = createLowlight()

const defaultContent = {
    type: "doc",
    content: [
        {
            type: "paragraph",
        },
    ],
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg",
                },
            }),
            Underline,
            Placeholder.configure({
                placeholder: "Start writing your story...",
            }),
        ],
        content: value ?? defaultContent,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON() as Record<string, unknown>)
        },
        immediatelyRender: false,
    })

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file")
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("type", "blog")

            const response = await fetch("/api/admin/uploads", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            const url = data.url

            if (editor && url) {
                editor.chain().focus().setImage({ src: url }).run()
                setIsImageDialogOpen(false)
                setImageUrl("")
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleImageUrl = () => {
        if (editor && imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setIsImageDialogOpen(false)
            setImageUrl("")
        }
    }

    const setLink = () => {
        if (!editor) return

        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const controls = useMemo(
        () => [
            {
                action: () => editor?.chain().focus().toggleBold().run(),
                label: "Bold",
                icon: Bold,
                isActive: editor?.isActive("bold"),
            },
            {
                action: () => editor?.chain().focus().toggleItalic().run(),
                label: "Italic",
                icon: Italic,
                isActive: editor?.isActive("italic"),
            },
            {
                action: () => editor?.chain().focus().toggleUnderline().run(),
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
            },
            {
                action: () => editor?.chain().focus().toggleStrike().run(),
                label: "Strikethrough",
                icon: Strikethrough,
                isActive: editor?.isActive("strike"),
            },
            {
                action: () => editor?.chain().focus().toggleCode().run(),
                label: "Inline Code",
                icon: Code,
                isActive: editor?.isActive("code"),
            },
            {
                action: () => editor?.chain().focus().toggleCodeBlock().run(),
                label: "Code Block",
                icon: Code2,
                isActive: editor?.isActive("codeBlock"),
            },
            {
                action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                label: "Heading 1",
                icon: Heading1,
                isActive: editor?.isActive("heading", { level: 1 }),
            },
            {
                action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                label: "Heading 2",
                icon: Heading2,
                isActive: editor?.isActive("heading", { level: 2 }),
            },
            {
                action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                label: "Heading 3",
                icon: Heading3,
                isActive: editor?.isActive("heading", { level: 3 }),
            },
            {
                action: () => editor?.chain().focus().toggleBulletList().run(),
                label: "Bullet List",
                icon: List,
                isActive: editor?.isActive("bulletList"),
            },
            {
                action: () => editor?.chain().focus().toggleOrderedList().run(),
                label: "Ordered List",
                icon: ListOrdered,
                isActive: editor?.isActive("orderedList"),
            },
            {
                action: () => editor?.chain().focus().toggleBlockquote().run(),
                label: "Quote",
                icon: Quote,
                isActive: editor?.isActive("blockquote"),
            },
            {
                action: setLink,
                label: "Link",
                icon: LinkIcon,
                isActive: editor?.isActive("link"),
            },
            {
                action: () => setIsImageDialogOpen(true),
                label: "Image",
                icon: ImageIcon,
                isActive: false,
            },
            {
                action: () => editor?.chain().focus().undo().run(),
                label: "Undo",
                icon: Undo,
                isActive: false,
                disabled: !editor?.can().undo(),
            },
            {
                action: () => editor?.chain().focus().redo().run(),
                label: "Redo",
                icon: Redo,
                isActive: false,
                disabled: !editor?.can().redo(),
            },
        ],
        [editor],
    )

    if (!editor) {
        return <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">Loading editor…</div>
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 rounded-md border bg-muted/30 p-2">
                {controls.map((control) => {
                    const Icon = control.icon
                    return (
                        <Button
                            key={control.label}
                            type="button"
                            variant={control.isActive ? "default" : "ghost"}
                            size="sm"
                            onClick={control.action}
                            disabled={control.disabled}
                            title={control.label}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="sr-only">{control.label}</span>
                        </Button>
                    )
                })}
            </div>

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image-url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                                <Button onClick={handleImageUrl} disabled={!imageUrl}>
                                    Insert
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image-upload">Upload Image</Label>
                            <Input
                                id="image-upload"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        handleImageUpload(file)
                                    }
                                }}
                                disabled={isUploading}
                            />
                            {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="rounded-md border bg-background">
                <EditorContent
                    editor={editor}
                    className={clsx(
                        "prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none",
                        "[&_.ProseMirror:focus]:outline-none [&_.ProseMirror]:min-h-[400px]",
                        "[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm",
                        "[&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:overflow-x-auto",
                        "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
                    )}
                />
            </div>
        </div>
    )
}
