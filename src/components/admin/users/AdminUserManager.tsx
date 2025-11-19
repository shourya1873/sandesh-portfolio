"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Edit, Trash2, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { AdminUserForm, type AdminUserFormValues } from "./AdminUserForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type AdminUser = {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
}

type AdminUserManagerProps = {
    initialUsers: AdminUser[]
}

const ITEMS_PER_PAGE = 12

export function AdminUserManager({ initialUsers }: AdminUserManagerProps) {
    const [users, setUsers] = useState(initialUsers)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Refetch users from server
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/admin/users")
                if (response.ok) {
                    const data = await response.json()
                    setUsers(data.users || [])
                }
            } catch (error) {
                console.error("Failed to fetch users:", error)
            }
        }
        fetchUsers()
    }, [])

    // Filter and search users
    const filteredUsers = useMemo(() => {
        let filtered = users

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.role.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [users, searchQuery])

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredUsers, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    async function handleSubmit(values: AdminUserFormValues) {
        setIsSubmitting(true)
        try {
            const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users"
            const method = editingUser ? "PUT" : "POST"

            const payload: any = {
                name: values.name,
                email: values.email,
                role: values.role,
            }

            // Only include password if it's provided
            if (values.password) {
                payload.password = values.password
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data?.message ?? "Failed to save user")
            }

            const data = (await response.json()) as { user: AdminUser }

            if (editingUser) {
                setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? data.user : u)))
            } else {
                setUsers((prev) => [data.user, ...prev])
            }

            setIsDialogOpen(false)
            setEditingUser(null)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to save user")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete user")
            }

            setUsers((prev) => prev.filter((u) => u.id !== id))
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete user")
        }
    }

    function handleEdit(user: AdminUser) {
        setEditingUser(user)
        setIsDialogOpen(true)
    }

    function handleNew() {
        setEditingUser(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
                    <p className="text-sm text-muted-foreground">Manage admin users and their permissions.</p>
                </div>
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add new user
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search users by name, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Showing {paginatedUsers.length} of {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>

            {/* Grid */}
            {paginatedUsers.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                        {searchQuery ? "No users match your search." : "No admin users yet. Create your first user above."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedUsers.map((user) => (
                            <Card key={user.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                            <CardTitle className="line-clamp-1">{user.name}</CardTitle>
                                        </div>
                                        <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-1">{user.email}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3">
                                    <p className="text-xs text-muted-foreground">
                                        Created {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(user)}>
                                            <Edit className="mr-2 h-3 w-3" />
                                            Edit
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
                                                        This will permanently delete "{user.name}" ({user.email}). This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) setEditingUser(null)
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit admin user" : "Add new admin user"}</DialogTitle>
                    </DialogHeader>
                    <AdminUserForm
                        initialValues={
                            editingUser
                                ? {
                                      name: editingUser.name,
                                      email: editingUser.email,
                                      role: editingUser.role as "admin" | "superadmin",
                                  }
                                : undefined
                        }
                        isEditing={!!editingUser}
                        submitLabel={isSubmitting ? "Saving..." : editingUser ? "Update user" : "Create user"}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

