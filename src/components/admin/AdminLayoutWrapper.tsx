"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./AdminSidebar"

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/admin/login"

    if (isLoginPage) {
        return <div className="min-h-screen bg-background text-foreground">{children}</div>
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="min-h-screen bg-background text-foreground">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

