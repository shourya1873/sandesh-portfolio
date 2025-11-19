import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import { db, admins } from "@/server/db"

const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z
        .union([z.string().min(6, "Password must be at least 6 characters"), z.literal("")])
        .optional()
        .transform((val) => (val === "" ? undefined : val)),
    role: z.string().optional(),
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()
        const parsed = updateUserSchema.parse(body)

        // Check if user exists
        const existing = await db.query.admins.findFirst({
            where: eq(admins.id, id),
        })

        if (!existing) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Check if email is being changed and if it's already taken
        if (parsed.email && parsed.email !== existing.email) {
            const emailExists = await db.query.admins.findFirst({
                where: eq(admins.email, parsed.email),
            })

            if (emailExists) {
                return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
            }
        }

        // Prepare update data
        const updateData: {
            name?: string
            email?: string
            passwordHash?: string
            role?: string
        } = {}

        if (parsed.name) updateData.name = parsed.name
        if (parsed.email) updateData.email = parsed.email
        if (parsed.role) updateData.role = parsed.role

        // Hash password if provided
        if (parsed.password) {
            updateData.passwordHash = await bcrypt.hash(parsed.password, 10)
        }

        // Update user
        const [updated] = await db
            .update(admins)
            .set(updateData)
            .where(eq(admins.id, id))
            .returning()

        // Remove password hash from response
        const { passwordHash: _, ...user } = updated

        return NextResponse.json({
            ok: true,
            user: {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-user-update]", error)
        return NextResponse.json({ message: "Unable to update user" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        // Check if user exists
        const existing = await db.query.admins.findFirst({
            where: eq(admins.id, id),
        })

        if (!existing) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Delete user
        await db.delete(admins).where(eq(admins.id, id))

        return NextResponse.json({ ok: true, message: "User deleted successfully" })
    } catch (error) {
        console.error("[admin-user-delete]", error)
        return NextResponse.json({ message: "Unable to delete user" }, { status: 500 })
    }
}

