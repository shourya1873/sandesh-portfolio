"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadMedia } from "@/lib/upload-client"
import { cn } from "@/lib/utils"

const galleryItemSchema = z.object({
    id: z.string().optional(),
    type: z.enum(["image", "video"]),
    url: z.string().min(1),
    caption: z.string().optional(),
    thumbnail: z.string().optional(),
})

const schema = z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    summary: z.string().min(10),
    description: z.string().min(20),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    youtubeUrl: z.string().optional(),
    status: z.enum(["draft", "published"]),
    gallery: z.array(galleryItemSchema).default([]),
})

export type ProjectFormValues = z.infer<typeof schema>

type ProjectFormProps = {
    initialValues?: Partial<ProjectFormValues>
    onSubmit: (values: ProjectFormValues) => Promise<void>
    submitLabel?: string
}

export function ProjectForm({ initialValues, onSubmit, submitLabel = "Save project" }: ProjectFormProps) {
    const [isUploadingHero, setIsUploadingHero] = useState(false)
    const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null)

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialValues?.title ?? "",
            slug: initialValues?.slug ?? "",
            summary: initialValues?.summary ?? "",
            description: initialValues?.description ?? "",
            heroImage: initialValues?.heroImage ?? "",
            heroImageAlt: initialValues?.heroImageAlt ?? "",
            youtubeUrl: initialValues?.youtubeUrl ?? "",
            status: initialValues?.status ?? "draft",
            gallery: initialValues?.gallery ?? [],
        },
    })

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "gallery",
    })

    async function handleHeroUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            setIsUploadingHero(true)
            const url = await uploadMedia(file, "projects")
            form.setValue("heroImage", url, { shouldDirty: true })
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to upload hero image")
        } finally {
            setIsUploadingHero(false)
        }
    }

    async function handleGalleryUpload(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            setUploadingGalleryIndex(index)
            const url = await uploadMedia(file, "projects")
            const current = fields[index]
            update(index, { ...current, url })
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to upload media")
        } finally {
            setUploadingGalleryIndex(null)
        }
    }

    function createGalleryId() {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID()
        }
        return Math.random().toString(36).slice(2)
    }

    function addGalleryItem(type: "image" | "video") {
        append({
            id: createGalleryId(),
            type,
            url: "",
            caption: "",
            thumbnail: "",
        })
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Project title" {...field} />
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
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="auto-generated if empty" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Summary</FormLabel>
                            <FormControl>
                                <Textarea rows={3} placeholder="Short overview for cards" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Detailed description</FormLabel>
                            <FormControl>
                                <Textarea rows={6} placeholder="Explain the challenge, approach, and impact" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="heroImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hero image</FormLabel>
                                <FormControl>
                                    <Input placeholder="Upload or paste URL" {...field} />
                                </FormControl>
                                <input type="file" accept="image/*" className="mt-2 text-sm" onChange={handleHeroUpload} />
                                <p className="text-xs text-muted-foreground">
                                    {isUploadingHero ? "Uploading..." : "Ideal ratio 16:9 (1200x675)."}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="heroImageAlt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hero image alt text</FormLabel>
                                <FormControl>
                                    <Input placeholder="Describe the hero visual" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Demo video (YouTube URL)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Gallery</p>
                            <p className="text-sm text-muted-foreground">Mix images and YouTube links for richer case studies.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => addGalleryItem("image")}>
                                Add image
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addGalleryItem("video")}>
                                Add video
                            </Button>
                        </div>
                    </div>

                    {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground">No gallery items yet. Add your first item above.</p>
                    )}

                    <ul className="space-y-4">
                        {fields.map((fieldItem, index) => (
                            <li key={fieldItem.id} className="rounded-md border p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold capitalize">{fieldItem.type}</p>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                </div>

                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            {fieldItem.type === "video" ? "YouTube URL" : "Media URL"}
                                        </label>
                                        <Input
                                            value={fieldItem.url}
                                            onChange={(event) =>
                                                update(index, { ...fieldItem, url: event.target.value })
                                            }
                                            placeholder={
                                                fieldItem.type === "video"
                                                    ? "https://youtube.com/watch?v=..."
                                                    : "Upload or paste URL"
                                            }
                                        />
                                        {fieldItem.type === "image" && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="text-xs"
                                                onChange={(event) => handleGalleryUpload(index, event)}
                                            />
                                        )}
                                        <p
                                            className={cn(
                                                "text-xs text-muted-foreground",
                                                uploadingGalleryIndex === index && "text-primary",
                                            )}
                                        >
                                            {uploadingGalleryIndex === index ? "Uploading..." : "Upload or paste media URL"}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Caption</label>
                                        <Textarea
                                            rows={2}
                                            value={fieldItem.caption ?? ""}
                                            onChange={(event) =>
                                                update(index, { ...fieldItem, caption: event.target.value })
                                            }
                                            placeholder="Short context for this media"
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                    {submitLabel}
                </Button>
            </form>
        </Form>
    )
}


