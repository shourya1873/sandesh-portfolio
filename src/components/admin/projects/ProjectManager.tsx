"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { ProjectForm, type ProjectFormValues } from "./ProjectForm"
import type { ProjectRecord } from "@/types/content"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type ProjectManagerProps = {
    initialProjects: ProjectRecord[]
}

const ITEMS_PER_PAGE = 12

export function ProjectManager({ initialProjects }: ProjectManagerProps) {
    const [projects, setProjects] = useState(initialProjects)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter and search projects
    const filteredProjects = useMemo(() => {
        let filtered = projects

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (project) =>
                    project.title.toLowerCase().includes(query) ||
                    project.summary.toLowerCase().includes(query) ||
                    project.slug.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query)
            )
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((project) => project.status === statusFilter)
        }

        return filtered
    }, [projects, searchQuery, statusFilter])

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredProjects.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredProjects, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

    async function handleSubmit(values: ProjectFormValues) {
        setIsSubmitting(true)
        try {
            const url = editingProject ? `/api/admin/projects/${editingProject.id}` : "/api/admin/projects"
            const method = editingProject ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data?.message ?? "Failed to save project")
            }
            const data = (await response.json()) as { project: ProjectRecord }
            if (editingProject) {
                setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? data.project : p)))
            } else {
                setProjects((prev) => [data.project, ...prev])
            }
            setIsDialogOpen(false)
            setEditingProject(null)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to save project")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error("Failed to delete project")
            }
            setProjects((prev) => prev.filter((p) => p.id !== id))
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete project")
        }
    }

    function handleEdit(project: ProjectRecord) {
        setEditingProject(project)
        setIsDialogOpen(true)
    }

    function handleNew() {
        setEditingProject(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <p className="text-sm text-muted-foreground">Document case studies with media galleries.</p>
                </div>
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add project
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search projects by title, summary, or description..."
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
                Showing {paginatedProjects.length} of {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
            </div>

            {/* Grid */}
            {paginatedProjects.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery || statusFilter !== "all" ? "No projects match your filters." : "No projects yet. Add your first build above."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedProjects.map((project) => (
                            <Card key={project.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                                {project.heroImage && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image src={project.heroImage} alt={project.heroImageAlt || project.title} fill className="object-cover" />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 flex-1">{project.title}</CardTitle>
                                        <Badge variant={project.status === "published" ? "default" : "secondary"}>{project.status}</Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">{project.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3">
                                    <p className="text-xs text-muted-foreground">
                                        Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(project)}>
                                            <Edit className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/project/${project.slug}`} target="_blank">
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
                                                        This will permanently delete "{project.title}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                if (!open) setEditingProject(null)
            }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit project" : "New project"}</DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                        initialValues={editingProject ? {
                            title: editingProject.title,
                            slug: editingProject.slug,
                            summary: editingProject.summary,
                            description: editingProject.description,
                            heroImage: editingProject.heroImage || "",
                            heroImageAlt: editingProject.heroImageAlt || "",
                            youtubeUrl: editingProject.youtubeUrl || "",
                            gallery: editingProject.gallery || [],
                            status: editingProject.status as "draft" | "published",
                            publishedAt: editingProject.publishedAt || "",
                        } : undefined}
                        submitLabel={isSubmitting ? "Saving..." : editingProject ? "Update project" : "Save project"}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
