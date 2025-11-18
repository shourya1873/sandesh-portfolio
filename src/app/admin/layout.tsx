import type { Metadata } from "next"
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper"

export const metadata: Metadata = {
    title: {
        default: "Admin",
        template: "%s | Admin",
    },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}


