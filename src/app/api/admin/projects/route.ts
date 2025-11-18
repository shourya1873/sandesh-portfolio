import { NextResponse } from "next/server"
import { z } from "zod"
import slugify from "slugify"
import { randomUUID } from "crypto"
import { desc } from "drizzle-orm"

import { db, projects } from "@/server/db"
import type { ProjectGalleryItem } from "@/server/db/schema"

const galleryItemSchema = z.object({
    id: z.string().optional(),
    type: z.enum(["image", "video"]),
    url: z.string().min(1),
    caption: z.string().optional(),
    thumbnail: z.string().optional(),
})

const projectSchema = z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    summary: z.string().min(10),
    description: z.string().min(20),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    youtubeUrl: z.string().url().optional(),
    gallery: z.array(galleryItemSchema).default([]),
    status: z.enum(["draft", "published"]),
    publishedAt: z
        .preprocess((val) => (val === "" || val === null ? undefined : val), z.string().datetime().optional()),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") ?? "1")
    const limit = Number(searchParams.get("limit") ?? "10")
    const offset = (page - 1) * limit

    const [items, total] = await Promise.all([
        db.query.projects.findMany({
            orderBy: desc(projects.createdAt),
            limit,
            offset,
        }),
        db.$count(projects),
    ])

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
        const parsed = projectSchema.parse(body)

        const slug =
            parsed.slug?.trim() ||
            slugify(parsed.title, {
                lower: true,
                strict: true,
            })

        const gallery: ProjectGalleryItem[] = parsed.gallery.map((item) => ({
            ...item,
            id: item.id ?? randomUUID(),
        }))

        const publishedAt =
            parsed.status === "published"
                ? parsed.publishedAt
                    ? new Date(parsed.publishedAt)
                    : new Date()
                : null

        const [inserted] = await db
            .insert(projects)
            .values({
                title: parsed.title,
                slug,
                summary: parsed.summary,
                description: parsed.description,
                heroImage: parsed.heroImage,
                heroImageAlt: parsed.heroImageAlt,
                youtubeUrl: parsed.youtubeUrl,
                gallery,
                status: parsed.status,
                publishedAt,
            })
            .returning()

        return NextResponse.json({ ok: true, project: inserted })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-project-create]", error)
        return NextResponse.json({ message: "Unable to create project" }, { status: 500 })
    }
}


