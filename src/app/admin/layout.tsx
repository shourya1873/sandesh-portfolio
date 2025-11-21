import type { Metadata } from "next"
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper"

// Force dynamic rendering for all admin pages - they require database access and authentication
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
    title: {
        default: "Admin",
        template: "%s | Admin",
    },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}


