"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Edit, Trash2, Download, FileText, Share2, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { ResourceForm, type ResourceFormValues } from "./ResourceForm"
import type { ResourceRecord } from "@/types/content"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type ResourceManagerProps = {
    initialResources: ResourceRecord[]
}

const ITEMS_PER_PAGE = 12

export function ResourceManager({ initialResources }: ResourceManagerProps) {
    const [resources, setResources] = useState(initialResources)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingResource, setEditingResource] = useState<ResourceRecord | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [copiedResourceId, setCopiedResourceId] = useState<string | null>(null)

    const filteredResources = useMemo(() => {
        let filtered = resources

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (resource) =>
                    resource.title.toLowerCase().includes(query) ||
                    resource.description?.toLowerCase().includes(query) ||
                    resource.fileName.toLowerCase().includes(query)
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((resource) => resource.status === statusFilter)
        }

        return filtered
    }, [resources, searchQuery, statusFilter])

    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE)
    const paginatedResources = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredResources.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredResources, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

    async function handleSubmit(values: ResourceFormValues) {
        setIsSubmitting(true)
        try {
            const url = editingResource ? `/api/admin/resources/${editingResource.id}` : "/api/admin/resources"
            const method = editingResource ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data?.message ?? "Failed to save resource")
            }
            const data = (await response.json()) as { resource: ResourceRecord }
            if (editingResource) {
                setResources((prev) => prev.map((r) => (r.id === editingResource.id ? data.resource : r)))
            } else {
                setResources((prev) => [data.resource, ...prev])
            }
            setIsDialogOpen(false)
            setEditingResource(null)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to save resource")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/admin/resources/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error("Failed to delete resource")
            }
            setResources((prev) => prev.filter((r) => r.id !== id))
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete resource")
        }
    }

    function handleEdit(resource: ResourceRecord) {
        setEditingResource(resource)
        setIsDialogOpen(true)
    }

    function handleNew() {
        setEditingResource(null)
        setIsDialogOpen(true)
    }

    function handleDownload(url: string, fileName: string) {
        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async function handleShare(resource: ResourceRecord) {
        try {
            const fullUrl = `${window.location.origin}${resource.fileUrl}`
            await navigator.clipboard.writeText(fullUrl)
            setCopiedResourceId(resource.id)
            toast.success("Link copied to clipboard!", {
                description: fullUrl,
            })
            setTimeout(() => setCopiedResourceId(null), 2000)
        } catch (error) {
            toast.error("Failed to copy link", {
                description: "Please try again",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
                    <p className="text-sm text-muted-foreground">Manage PDF resources for your content creation channel.</p>
                </div>
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Resource
                </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search resources by title, description, or filename..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-muted-foreground">
                Showing {paginatedResources.length} of {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
            </div>

            {paginatedResources.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== "all" ? "No resources match your filters." : "No resources yet. Upload your first PDF above."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {paginatedResources.map((resource) => (
                            <Card key={resource.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <CardTitle className="line-clamp-2 flex-1">{resource.title}</CardTitle>
                                        </div>
                                        <Badge variant={resource.status === "active" ? "default" : "secondary"}>{resource.status}</Badge>
                                    </div>
                                    {resource.description && <CardDescription className="line-clamp-2">{resource.description}</CardDescription>}
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3">
                                    <div className="text-xs text-muted-foreground">
                                        <p className="truncate">{resource.fileName}</p>
                                        {resource.fileSize && <p>{resource.fileSize}</p>}
                                        <p>Updated {formatDistanceToNow(new Date(resource.updatedAt), { addSuffix: true })}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[100px]"
                                            onClick={() => handleDownload(resource.fileUrl, resource.fileName)}
                                        >
                                            <Download className="mr-2 h-3 w-3" />
                                            Download
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleShare(resource)}
                                            className={`min-w-[85px] ${copiedResourceId === resource.id ? "bg-green-50 text-green-700 hover:bg-green-100" : ""}`}
                                        >
                                            {copiedResourceId === resource.id ? (
                                                <>
                                                    <Check className="mr-2 h-3 w-3" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Share2 className="mr-2 h-3 w-3" />
                                                    Share
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(resource)} className="min-w-[70px]">
                                            <Edit className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive min-w-[40px]">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete "{resource.title}" and its file. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(resource.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) setEditingResource(null)
            }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingResource ? "Edit Resource" : "Upload New Resource"}</DialogTitle>
                    </DialogHeader>
                    <ResourceForm
                        initialValues={editingResource ? {
                            title: editingResource.title,
                            description: editingResource.description || "",
                            fileUrl: editingResource.fileUrl,
                            fileName: editingResource.fileName,
                            fileSize: editingResource.fileSize || "",
                            status: editingResource.status as "active" | "inactive",
                        } : undefined}
                        submitLabel={isSubmitting ? "Saving..." : editingResource ? "Update Resource" : "Save Resource"}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

