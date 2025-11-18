import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import { db, admins } from "@/server/db"
import { signAdminToken } from "@/lib/jwt"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = loginSchema.parse(body)

        const admin = await db.query.admins.findFirst({
            where: eq(admins.email, email),
        })

        if (!admin) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        const token = await signAdminToken({
            sub: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        })

        const response = NextResponse.json({
            ok: true,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        })

        response.cookies.set({
            name: "admin_token",
            value: token,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
        })

        return response
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }
        console.error("[admin-login]", error)
        return NextResponse.json({ message: "Unable to sign in right now" }, { status: 500 })
    }
}


