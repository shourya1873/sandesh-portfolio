import { desc } from "drizzle-orm"

import { db, resources } from "@/server/db"
import { ResourceManager } from "@/components/admin/resources/ResourceManager"
import type { ResourceRecord } from "@/types/content"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminResourcesPage() {
    const items = await db.query.resources.findMany({
        orderBy: desc(resources.updatedAt),
        limit: 20,
    })

    const serialized: ResourceRecord[] = items.map((item) => ({
        ...item,
        description: item.description ?? null,
        fileSize: item.fileSize ?? null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center gap-4">
                    <SidebarTrigger />
                </div>
                <ResourceManager initialResources={serialized} />
            </div>
        </main>
    )
}

