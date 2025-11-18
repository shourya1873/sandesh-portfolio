import { desc } from "drizzle-orm"

import { db, projects } from "@/server/db"
import { ProjectManager } from "@/components/admin/projects/ProjectManager"
import type { ProjectRecord } from "@/types/content"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function AdminProjectsPage() {
    const items = await db.query.projects.findMany({
        orderBy: desc(projects.updatedAt),
        limit: 20,
    })

    const serialized: ProjectRecord[] = items.map((item) => ({
        ...item,
        heroImage: item.heroImage ?? null,
        heroImageAlt: item.heroImageAlt ?? null,
        youtubeUrl: item.youtubeUrl ?? null,
        publishedAt: item.publishedAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center gap-4">
                    <SidebarTrigger />
                </div>
                <ProjectManager initialProjects={serialized} />
            </div>
        </main>
    )
}


