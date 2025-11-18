"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor"
import { uploadMedia } from "@/lib/upload-client"

const schema = z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    excerpt: z.string().min(10),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    status: z.enum(["draft", "published"]),
    publishedAt: z.string().optional(),
    content: z.any(),
})

export type BlogFormValues = z.infer<typeof schema>

const defaultContent = {
    type: "doc",
    content: [
        {
            type: "paragraph",
            content: [{ type: "text", text: "Start writing your story..." }],
        },
    ],
}

type BlogFormProps = {
    initialValues?: Partial<BlogFormValues>
    onSubmit: (values: BlogFormValues) => Promise<void>
    submitLabel?: string
}

export function BlogForm({ initialValues, onSubmit, submitLabel = "Save blog" }: BlogFormProps) {
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialValues?.title ?? "",
            slug: initialValues?.slug ?? "",
            excerpt: initialValues?.excerpt ?? "",
            coverImage: initialValues?.coverImage ?? "",
            coverImageAlt: initialValues?.coverImageAlt ?? "",
            status: (initialValues?.status as "draft" | "published") ?? "draft",
            publishedAt: initialValues?.publishedAt ?? "",
            content: initialValues?.content && typeof initialValues.content === "object" ? initialValues.content : defaultContent,
        },
    })

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            setIsUploading(true)
            const url = await uploadMedia(file, "blogs")
            form.setValue("coverImage", url, { shouldDirty: true })
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : "Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (values: BlogFormValues) => {
        // Ensure content is always an object
        if (!values.content || typeof values.content !== "object") {
            values.content = defaultContent
        }
        await onSubmit(values)
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Blog title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="auto-generated if empty" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                                <Textarea rows={3} placeholder="Short summary for cards" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover image</FormLabel>
                                <FormControl>
                                    <Input placeholder="Upload or paste URL" {...field} />
                                </FormControl>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 text-sm"
                                    onChange={handleUpload}
                                    disabled={isUploading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {isUploading ? "Uploading..." : "Upload a cover image or paste an existing URL"}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="coverImageAlt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover image alt text</FormLabel>
                                <FormControl>
                                    <Input placeholder="Describe the cover image" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <RichTextEditor value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full md:w-auto">
                    {submitLabel}
                </Button>
            </form>
        </Form>
    )
}


