import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { siteConfig } from "@/server/db/schema"

export async function GET() {
    try {
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
        console.error("Error fetching public config:", error)
        return NextResponse.json({
            gtmId: "",
            gaId: "",
            adsenseId: "",
        })
    }
}

