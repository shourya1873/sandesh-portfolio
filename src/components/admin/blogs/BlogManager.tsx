"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { BlogForm, type BlogFormValues } from "./BlogForm"
import type { BlogRecord } from "@/types/content"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type BlogManagerProps = {
    initialBlogs: BlogRecord[]
}

const ITEMS_PER_PAGE = 12

export function BlogManager({ initialBlogs }: BlogManagerProps) {
    const [blogs, setBlogs] = useState(initialBlogs)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingBlog, setEditingBlog] = useState<BlogRecord | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter and search blogs
    const filteredBlogs = useMemo(() => {
        let filtered = blogs

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(query) ||
                    blog.excerpt.toLowerCase().includes(query) ||
                    blog.slug.toLowerCase().includes(query)
            )
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((blog) => blog.status === statusFilter)
        }

        return filtered
    }, [blogs, searchQuery, statusFilter])

    // Pagination
    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
    const paginatedBlogs = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredBlogs.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredBlogs, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

    async function handleSubmit(values: BlogFormValues) {
        setIsSubmitting(true)
        try {
            const url = editingBlog ? `/api/admin/blogs/${editingBlog.id}` : "/api/admin/blogs"
            const method = editingBlog ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data?.message ?? "Failed to save blog")
            }
            const data = (await response.json()) as { blog: BlogRecord }
            if (editingBlog) {
                setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? data.blog : b)))
            } else {
                setBlogs((prev) => [data.blog, ...prev])
            }
            setIsDialogOpen(false)
            setEditingBlog(null)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to save blog")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/admin/blogs/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error("Failed to delete blog")
            }
            setBlogs((prev) => prev.filter((b) => b.id !== id))
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete blog")
        }
    }

    function handleEdit(blog: BlogRecord) {
        setEditingBlog(blog)
        setIsDialogOpen(true)
    }

    function handleNew() {
        setEditingBlog(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog posts</h1>
                    <p className="text-sm text-muted-foreground">Create long-form updates with the TipTap builder.</p>
                </div>
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create new blog
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search blogs by title, excerpt, or slug..."
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
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Showing {paginatedBlogs.length} of {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? "s" : ""}
            </div>

            {/* Grid */}
            {paginatedBlogs.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== "all" ? "No blogs match your filters." : "No blog posts yet. Create your first story above."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedBlogs.map((blog) => (
                            <Card key={blog.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                                {blog.coverImage && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image src={blog.coverImage} alt={blog.coverImageAlt || blog.title} fill className="object-cover" />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 flex-1">{blog.title}</CardTitle>
                                        <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3">
                                    <p className="text-xs text-muted-foreground">
                                        Updated {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(blog)}>
                                            <Edit className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/blog/${blog.slug}`} target="_blank">
                                                <Eye className="mr-2 h-3 w-3" />
                                                View
                                            </Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete "{blog.title}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(blog.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

                    {/* Pagination */}
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

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) setEditingBlog(null)
            }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingBlog ? "Edit blog post" : "New blog post"}</DialogTitle>
                    </DialogHeader>
                    <BlogForm
                        initialValues={editingBlog ? {
                            title: editingBlog.title,
                            slug: editingBlog.slug,
                            excerpt: editingBlog.excerpt,
                            coverImage: editingBlog.coverImage || "",
                            coverImageAlt: editingBlog.coverImageAlt || "",
                            status: editingBlog.status as "draft" | "published",
                            publishedAt: editingBlog.publishedAt || "",
                            content: editingBlog.content,
                        } : undefined}
                        submitLabel={isSubmitting ? "Saving..." : editingBlog ? "Update blog" : "Save blog"}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
