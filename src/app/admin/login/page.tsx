import { Metadata } from "next"

import { LoginForm } from "@/components/admin/LoginForm"

export const metadata: Metadata = {
    title: "Admin Login",
}

export default function AdminLoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-16">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 md:flex-row">
                <div className="max-w-xl space-y-4 text-center md:text-left">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Sandesh Admin</p>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Manage content securely with the admin panel
                    </h1>
                    <p className="text-base text-muted-foreground sm:text-lg">
                        Sign in to access the dashboard, publish new sections, and monitor activity. Only authorized team
                        members can enter.
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}


