import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import { desc } from "drizzle-orm"

import { db, admins } from "@/server/db"

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().default("admin"),
})

export async function GET() {
    try {
        const users = await db.query.admins.findMany({
            orderBy: desc(admins.createdAt),
        })

        // Remove password hashes from response
        const sanitizedUsers = users.map(({ passwordHash, ...user }) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }))

        return NextResponse.json({ users: sanitizedUsers })
    } catch (error) {
        console.error("[admin-users-list]", error)
        return NextResponse.json({ message: "Unable to fetch users" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, role } = createUserSchema.parse(body)

        // Check if user already exists
        const existing = await db.query.admins.findFirst({
            where: eq(admins.email, email),
        })

        if (existing) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const [inserted] = await db
            .insert(admins)
            .values({
                name,
                email,
                passwordHash,
                role: role || "admin",
            })
            .returning()

        // Remove password hash from response
        const { passwordHash: _, ...user } = inserted

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
        console.error("[admin-user-create]", error)
        return NextResponse.json({ message: "Unable to create user" }, { status: 500 })
    }
}

