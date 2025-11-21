import { cookies } from "next/headers"
import Link from "next/link"

import { verifyAdminToken } from "@/lib/jwt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Force dynamic rendering - admin pages require authentication
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getAdminProfile() {
    const token = cookies().get("admin_token")?.value
    if (!token) return null

    try {
        const payload = await verifyAdminToken(token)
        return payload
    } catch {
        return null
    }
}

export default async function AdminDashboardPage() {
    const admin = await getAdminProfile()

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <header className="flex items-center gap-4 rounded-2xl border bg-background px-6 py-6 shadow-sm">
                    <SidebarTrigger />
                    <div className="flex-1">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary">Dashboard</p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back{admin ? `, ${admin.name}` : ""}</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your portfolio content, monitor submissions, and keep everything up to date.
                        </p>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-semibold">Account</CardTitle>
                            <Badge variant="secondary">{admin?.role ?? "admin"}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <CardDescription className="text-base font-medium">{admin?.name ?? "Admin"}</CardDescription>
                            <p className="text-sm text-muted-foreground">{admin?.email ?? "—"}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle>Quick actions</CardTitle>
                            <CardDescription>Jump into content management</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Link
                                href="/admin/blogs"
                                className="rounded-md border px-4 py-3 text-sm font-medium hover:border-primary"
                            >
                                Manage blogs
                            </Link>
                            <Link
                                href="/admin/projects"
                                className="rounded-md border px-4 py-3 text-sm font-medium hover:border-primary"
                            >
                                Manage projects
                            </Link>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    )
}


