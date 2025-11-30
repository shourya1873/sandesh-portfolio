import { NextResponse } from "next/server"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { unlink } from "fs/promises"
import path from "path"

import { db, resources } from "@/server/db"

const resourceInputSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    fileUrl: z.string().min(1),
    fileName: z.string().min(1),
    fileSize: z.string().optional(),
    status: z.enum(["active", "inactive"]),
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const resource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    })

    if (!resource) {
        return NextResponse.json({ message: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ resource })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const parsed = resourceInputSchema.parse(body)

        const [updated] = await db
            .update(resources)
            .set({
                title: parsed.title,
                description: parsed.description || null,
                fileUrl: parsed.fileUrl,
                fileName: parsed.fileName,
                fileSize: parsed.fileSize || null,
                status: parsed.status,
                updatedAt: new Date(),
            })
            .where(eq(resources.id, id))
            .returning()

        if (!updated) {
            return NextResponse.json({ message: "Resource not found" }, { status: 404 })
        }

        return NextResponse.json({ ok: true, resource: updated })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-resource-update]", error)
        return NextResponse.json({ message: "Unable to update resource" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        // Get the resource first to delete the file
        const resource = await db.query.resources.findFirst({
            where: eq(resources.id, id),
        })

        if (!resource) {
            return NextResponse.json({ message: "Resource not found" }, { status: 404 })
        }

        // Delete the file from filesystem
        try {
            const filePath = path.join(process.cwd(), "public", resource.fileUrl)
            await unlink(filePath)
        } catch (fileError) {
            console.error("[admin-resource-delete-file]", fileError)
            // Continue with database deletion even if file deletion fails
        }

        await db.delete(resources).where(eq(resources.id, id))

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[admin-resource-delete]", error)
        return NextResponse.json({ message: "Unable to delete resource" }, { status: 500 })
    }
}

