import { NextResponse } from "next/server"
import { z } from "zod"
import slugify from "slugify"
import { desc } from "drizzle-orm"

import { db, blogs } from "@/server/db"

const blogInputSchema = z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    excerpt: z.string().min(10),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    content: z.any(),
    status: z.enum(["draft", "published"]),
    publishedAt: z
        .preprocess((val) => (val === "" || val === null ? undefined : val), z.string().datetime().optional()),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") ?? "1")
    const limit = Number(searchParams.get("limit") ?? "10")
    const offset = (page - 1) * limit
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status") || ""

    // Fetch all items and filter in memory (for small datasets)
    // For production with large datasets, use proper SQL where clauses
    let allItems = await db.query.blogs.findMany({
        orderBy: desc(blogs.createdAt),
    })

    // Apply filters
    if (search) {
        const searchLower = search.toLowerCase()
        allItems = allItems.filter(
            (item) =>
                item.title.toLowerCase().includes(searchLower) ||
                item.excerpt.toLowerCase().includes(searchLower) ||
                item.slug.toLowerCase().includes(searchLower)
        )
    }
    if (status) {
        allItems = allItems.filter((item) => item.status === status)
    }

    const total = allItems.length
    const items = allItems.slice(offset, offset + limit)

    return NextResponse.json({
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = blogInputSchema.parse(body)

        const slug =
            parsed.slug?.trim() ||
            slugify(parsed.title, {
                lower: true,
                strict: true,
            })

        const publishedAt =
            parsed.status === "published"
                ? parsed.publishedAt
                    ? new Date(parsed.publishedAt)
                    : new Date()
                : null

        const [inserted] = await db
            .insert(blogs)
            .values({
                title: parsed.title,
                slug,
                excerpt: parsed.excerpt,
                coverImage: parsed.coverImage,
                coverImageAlt: parsed.coverImageAlt,
                content: parsed.content,
                status: parsed.status,
                publishedAt,
            })
            .returning()

        return NextResponse.json({ ok: true, blog: inserted })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-blog-create]", error)
        return NextResponse.json({ message: "Unable to create blog" }, { status: 500 })
    }
}


