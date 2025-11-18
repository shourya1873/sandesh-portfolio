import { NextRequest, NextResponse } from "next/server"
import { db } from "@/server/db"
import { siteConfig } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { z } from "zod"

const configSchema = z.object({
    gtmId: z.string().optional(),
    gaId: z.string().optional(),
    adsenseId: z.string().optional(),
})

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifyAdminToken(token)
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const configs = await db.select().from(siteConfig)

        const configMap: Record<string, string> = {}
        configs.forEach((config) => {
            configMap[config.key] = config.value ?? ""
        })

        return NextResponse.json({
            gtmId: configMap.gtm_id || "",
            gaId: configMap.ga_id || "",
            adsenseId: configMap.adsense_id || "",
        })
    } catch (error) {
        console.error("Error fetching config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifyAdminToken(token)
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validated = configSchema.parse(body)

        // Update or insert each config value
        const configs = [
            { key: "gtm_id", value: validated.gtmId || null },
            { key: "ga_id", value: validated.gaId || null },
            { key: "adsense_id", value: validated.adsenseId || null },
        ]

        for (const config of configs) {
            const existing = await db.select().from(siteConfig).where(eq(siteConfig.key, config.key)).limit(1)

            if (existing.length > 0) {
                await db.update(siteConfig).set({ value: config.value, updatedAt: new Date() }).where(eq(siteConfig.key, config.key))
            } else {
                await db.insert(siteConfig).values({ key: config.key, value: config.value })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
        }
        console.error("Error updating config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

