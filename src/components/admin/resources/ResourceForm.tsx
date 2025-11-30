"use client"

import { useState, useRef } from "react"
import { Upload, FileText, X } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const resourceFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    fileUrl: z.string().min(1, "File is required"),
    fileName: z.string().min(1, "File is required"),
    fileSize: z.string().optional(),
    status: z.enum(["active", "inactive"]),
})

export type ResourceFormValues = z.infer<typeof resourceFormSchema>

type ResourceFormProps = {
    initialValues?: ResourceFormValues
    submitLabel?: string
    onSubmit: (values: ResourceFormValues) => void | Promise<void>
}

export function ResourceForm({ initialValues, submitLabel = "Save Resource", onSubmit }: ResourceFormProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; size: string } | null>(
        initialValues ? { url: initialValues.fileUrl, name: initialValues.fileName, size: initialValues.fileSize || "" } : null
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceFormSchema),
        defaultValues: initialValues || {
            title: "",
            description: "",
            fileUrl: "",
            fileName: "",
            fileSize: "",
            status: "active",
        },
    })

    async function handleFileUpload(file: File) {
        if (!file.type.includes("pdf")) {
            alert("Please upload a PDF file")
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "resources")

            const response = await fetch("/api/admin/uploads", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to upload file")
            }

            const data = await response.json()
            const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB"

            setUploadedFile({
                url: data.url,
                name: file.name,
                size: fileSize,
            })

            form.setValue("fileUrl", data.url)
            form.setValue("fileName", file.name)
            form.setValue("fileSize", fileSize)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to upload file")
        } finally {
            setIsUploading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    function handleRemoveFile() {
        setUploadedFile(null)
        form.setValue("fileUrl", "")
        form.setValue("fileName", "")
        form.setValue("fileSize", "")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., React Best Practices Guide" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief description of the resource..." rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PDF File *</FormLabel>
                            <FormControl>
                                {uploadedFile ? (
                                    <div className="flex items-center gap-3 rounded-lg border p-4">
                                        <FileText className="h-8 w-8 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium">{uploadedFile.name}</p>
                                            <p className="text-sm text-muted-foreground">{uploadedFile.size}</p>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
                                        <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="text-sm font-medium text-primary hover:underline">Click to upload PDF</span>
                                            <input
                                                ref={fileInputRef}
                                                id="file-upload"
                                                type="file"
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-muted-foreground">PDF files only</p>
                                        {isUploading && <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>}
                                    </div>
                                )}
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
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                        {form.formState.isSubmitting ? "Saving..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

