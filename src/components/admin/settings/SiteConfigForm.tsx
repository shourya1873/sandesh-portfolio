"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

const configSchema = z.object({
    gtmId: z.string().optional(),
    gaId: z.string().optional(),
    adsenseId: z.string().optional(),
})

type ConfigFormValues = z.infer<typeof configSchema>

interface SiteConfigFormProps {
    initialData: {
        gtmId: string
        gaId: string
        adsenseId: string
    }
}

export function SiteConfigForm({ initialData }: SiteConfigFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ConfigFormValues>({
        resolver: zodResolver(configSchema),
        defaultValues: {
            gtmId: initialData.gtmId || "",
            gaId: initialData.gaId || "",
            adsenseId: initialData.adsenseId || "",
        },
    })

    async function onSubmit(values: ConfigFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/admin/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || "Failed to update configuration")
            }

            toast.success("Configuration updated successfully")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong. Please try again."
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="gtmId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Google Tag Manager ID</FormLabel>
                            <FormControl>
                                <Input placeholder="GTM-XXXXXXX" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Google Tag Manager container ID (e.g., GTM-XXXXXXX)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gaId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Google Analytics ID</FormLabel>
                            <FormControl>
                                <Input placeholder="G-XXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Google Analytics measurement ID (e.g., G-XXXXXXXXXX)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adsenseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Google AdSense ID</FormLabel>
                            <FormControl>
                                <Input placeholder="ca-pub-XXXXXXXXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Google AdSense publisher ID (e.g., ca-pub-XXXXXXXXXXXXXXXX)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Configuration"}
                </Button>
            </form>
        </Form>
    )
}

