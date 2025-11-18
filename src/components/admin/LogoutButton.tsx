"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleLogout = () => {
        startTransition(async () => {
            await fetch("/api/admin/logout", { method: "POST" })
            router.replace("/admin/login")
        })
    }

    return (
        <Button variant="outline" onClick={handleLogout} disabled={isPending}>
            {isPending ? "Signing out..." : "Sign out"}
        </Button>
    )
}


