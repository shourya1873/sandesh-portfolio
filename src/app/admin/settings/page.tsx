import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteConfigForm } from "@/components/admin/settings/SiteConfigForm"
import { cookies } from "next/headers"
import { db } from "@/server/db"
import { siteConfig } from "@/server/db/schema"
import { verifyAdminToken } from "@/lib/jwt"

export const dynamic = "force-dynamic"

async function getConfig() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_token")?.value

        if (!token) {
            return { gtmId: "", gaId: "", adsenseId: "" }
        }

        const payload = await verifyAdminToken(token)
        if (!payload) {
            return { gtmId: "", gaId: "", adsenseId: "" }
        }

        const configs = await db.select().from(siteConfig)

        const configMap: Record<string, string> = {}
        configs.forEach((config) => {
            configMap[config.key] = config.value ?? ""
        })

        return {
            gtmId: configMap.gtm_id || "",
            gaId: configMap.ga_id || "",
            adsenseId: configMap.adsense_id || "",
        }
    } catch (error) {
        console.error("Error fetching config:", error)
        return { gtmId: "", gaId: "", adsenseId: "" }
    }
}

export default async function AdminSettingsPage() {
    const config = await getConfig()

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                        <p className="text-sm text-muted-foreground">Manage site configuration and integrations</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Configuration</CardTitle>
                            <CardDescription>Configure Google Tag Manager, Google Analytics, and AdSense</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SiteConfigForm initialData={config} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
