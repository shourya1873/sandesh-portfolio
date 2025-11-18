"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const [status, setStatus] = useState<{ type: "error"; message: string } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
        setIsSubmitting(true)
        setStatus(null)
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data?.message ?? "Unable to sign in")
            }

            router.replace("/admin")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            setStatus({ type: "error", message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                <CardDescription>Sign in with your administrator credentials</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {status && (
                            <p className="text-sm text-destructive" role="alert">
                                {status.message}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


