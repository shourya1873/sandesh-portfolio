import { desc } from "drizzle-orm"

import { db, admins } from "@/server/db"
import { AdminUserManager } from "@/components/admin/users/AdminUserManager"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Force dynamic rendering - admin pages require database access
export const dynamic = "force-dynamic"
export const revalidate = 0

type AdminUser = {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
}

export default async function AdminUsersPage() {
    const items = await db.query.admins.findMany({
        orderBy: desc(admins.createdAt),
    })

    const serialized: AdminUser[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center gap-4">
                    <SidebarTrigger />
                </div>
                <AdminUserManager initialUsers={serialized} />
            </div>
        </main>
    )
}

