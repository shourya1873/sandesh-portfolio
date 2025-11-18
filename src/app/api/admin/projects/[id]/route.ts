import { NextResponse } from "next/server"
import { z } from "zod"
import slugify from "slugify"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"

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

type Params = {
    params: {
        id: string
    }
}

export async function GET(_: Request, { params }: Params) {
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, params.id),
    })

    if (!project) {
        return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
}

export async function PUT(request: Request, { params }: Params) {
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

        const [updated] = await db
            .update(projects)
            .set({
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
            .where(eq(projects.id, params.id))
            .returning()

        if (!updated) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 })
        }

        return NextResponse.json({ ok: true, project: updated })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-project-update]", error)
        return NextResponse.json({ message: "Unable to update project" }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: Params) {
    const [deleted] = await db.delete(projects).where(eq(projects.id, params.id)).returning({ id: projects.id })

    if (!deleted) {
        return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
}


