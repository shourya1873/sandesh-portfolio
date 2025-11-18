import { NextResponse } from "next/server"
import { z } from "zod"
import slugify from "slugify"
import { eq } from "drizzle-orm"

import { db, blogs } from "@/server/db"

const blogUpdateSchema = z.object({
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

type Params = {
    params: {
        id: string
    }
}

export async function GET(_: Request, { params }: Params) {
    const blog = await db.query.blogs.findFirst({
        where: eq(blogs.id, params.id),
    })

    if (!blog) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ blog })
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const body = await request.json()
        const parsed = blogUpdateSchema.parse(body)

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

        const [updated] = await db
            .update(blogs)
            .set({
                title: parsed.title,
                slug,
                excerpt: parsed.excerpt,
                coverImage: parsed.coverImage,
                coverImageAlt: parsed.coverImageAlt,
                content: parsed.content,
                status: parsed.status,
                publishedAt,
            })
            .where(eq(blogs.id, params.id))
            .returning()

        if (!updated) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 })
        }

        return NextResponse.json({ ok: true, blog: updated })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-blog-update]", error)
        return NextResponse.json({ message: "Unable to update blog" }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const [deleted] = await db.delete(blogs).where(eq(blogs.id, params.id)).returning({ id: blogs.id })

    if (!deleted) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
}


