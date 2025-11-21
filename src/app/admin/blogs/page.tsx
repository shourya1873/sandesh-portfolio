import { desc } from "drizzle-orm"

import { db, blogs } from "@/server/db"
import { BlogManager } from "@/components/admin/blogs/BlogManager"
import type { BlogRecord } from "@/types/content"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Force dynamic rendering - admin pages require database access
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminBlogsPage() {
    const items = await db.query.blogs.findMany({
        orderBy: desc(blogs.updatedAt),
        limit: 20,
    })

    const serialized: BlogRecord[] = items.map((item) => ({
        ...item,
        coverImage: item.coverImage ?? null,
        coverImageAlt: item.coverImageAlt ?? null,
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
                <BlogManager initialBlogs={serialized} />
            </div>
        </main>
    )
}


