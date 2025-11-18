import Link from "next/link"

import { getLatestBlogs } from "@/lib/content"
import { BlogCarousel } from "./BlogCarousel"
import { LatestBlogsClient } from "./LatestBlogsClient"
import type { BlogRecord } from "@/types/content"

export async function LatestBlogs() {
    const blogs = await getLatestBlogs(6)

    if (!blogs.length) return null

    const serialized: BlogRecord[] = blogs.map((blog) => ({
        ...blog,
        coverImage: blog.coverImage ?? null,
        coverImageAlt: blog.coverImageAlt ?? null,
        publishedAt: blog.publishedAt?.toISOString() ?? null,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
    }))

    return <LatestBlogsClient items={serialized} />
}
