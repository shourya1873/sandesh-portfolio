import { NextResponse } from "next/server"
import { z } from "zod"
import { desc } from "drizzle-orm"

import { db, resources } from "@/server/db"

const resourceInputSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    fileUrl: z.string().min(1),
    fileName: z.string().min(1),
    fileSize: z.string().optional(),
    status: z.enum(["active", "inactive"]),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") ?? "1")
    const limit = Number(searchParams.get("limit") ?? "10")
    const offset = (page - 1) * limit
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status") || ""

    let allItems = await db.query.resources.findMany({
        orderBy: desc(resources.createdAt),
    })

    if (search) {
        const searchLower = search.toLowerCase()
        allItems = allItems.filter(
            (item) =>
                item.title.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower) ||
                item.fileName.toLowerCase().includes(searchLower)
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
        const parsed = resourceInputSchema.parse(body)

        const [inserted] = await db
            .insert(resources)
            .values({
                title: parsed.title,
                description: parsed.description || null,
                fileUrl: parsed.fileUrl,
                fileName: parsed.fileName,
                fileSize: parsed.fileSize || null,
                status: parsed.status,
            })
            .returning()

        return NextResponse.json({ ok: true, resource: inserted })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-resource-create]", error)
        return NextResponse.json({ message: "Unable to create resource" }, { status: 500 })
    }
}

