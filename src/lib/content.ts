import { cache } from "react"
import { and, count, desc, eq } from "drizzle-orm"

import { db, blogs, projects } from "@/server/db"

export const getLatestBlogs = cache(async (limit = 6) => {
    const allPublished = await db.query.blogs.findMany({
        where: eq(blogs.status, "published"),
    })
    
    // Sort by publishedAt (most recent first), then by createdAt if publishedAt is null
    const sorted = allPublished.sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        }
        if (a.publishedAt) return -1
        if (b.publishedAt) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    const items = sorted.slice(0, limit)

    return items.map((item) => ({
        ...item,
        coverImage: item.coverImage ?? null,
        coverImageAlt: item.coverImageAlt ?? null,
    }))
})

export const getLatestProjects = cache(async (limit = 6) => {
    const items = await db.query.projects.findMany({
        where: eq(projects.status, "published"),
        orderBy: desc(projects.publishedAt),
        limit,
    })

    return items.map((item) => ({
        ...item,
        heroImage: item.heroImage ?? null,
        heroImageAlt: item.heroImageAlt ?? null,
    }))
})

export const getBlogBySlug = cache(async (slug: string) => {
    return db.query.blogs.findFirst({
        where: eq(blogs.slug, slug),
    })
})

export const getPublishedBlogBySlug = cache(async (slug: string) => {
    return db.query.blogs.findFirst({
        where: and(eq(blogs.slug, slug), eq(blogs.status, "published")),
    })
})

export const getProjectBySlug = cache(async (slug: string) => {
    return db.query.projects.findFirst({
        where: eq(projects.slug, slug),
    })
})

export const getPublishedProjectBySlug = cache(async (slug: string) => {
    return db.query.projects.findFirst({
        where: and(eq(projects.slug, slug), eq(projects.status, "published")),
    })
})

export const getBlogsPaginated = cache(async (page = 1, limit = 6) => {
    const offset = (page - 1) * limit
    
    // Get all published blogs first
    const allPublished = await db.query.blogs.findMany({
        where: eq(blogs.status, "published"),
    })
    
    // Sort by publishedAt (most recent first), then by createdAt if publishedAt is null
    const sorted = allPublished.sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        }
        if (a.publishedAt) return -1
        if (b.publishedAt) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    const total = sorted.length
    const items = sorted.slice(offset, offset + limit)
    
    return { items, total, pages: Math.ceil(total / limit) }
})

export const getProjectsPaginated = cache(async (page = 1, limit = 6) => {
    const offset = (page - 1) * limit
    const [items, totalResult] = await Promise.all([
        db.query.projects.findMany({
            where: eq(projects.status, "published"),
            orderBy: desc(projects.publishedAt),
            limit,
            offset,
        }),
        db
            .select({ value: count() })
            .from(projects)
            .where(eq(projects.status, "published"))
            .limit(1),
    ])
    const total = totalResult[0]?.value ?? 0
    return { items, total, pages: Math.ceil(total / limit) }
})


