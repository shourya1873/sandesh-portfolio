"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, useInView } from "motion/react"
import React from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contactSchema = z.object({
    fullName: z.string().min(2, "Please enter at least 2 characters."),
    email: z.string().email("Please enter a valid email."),
    message: z.string().min(10, "Message should be at least 10 characters."),
})

type ContactFormValues = z.infer<typeof contactSchema>

const defaultValues: ContactFormValues = {
    fullName: "",
    email: "",
    message: "",
}

type StatusState = {
    type: "success" | "error"
    message: string
} | null

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<StatusState>(null)
    const containerRef = React.useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues,
    })

    async function onSubmit(values: ContactFormValues) {
        setIsSubmitting(true)
        setStatus(null)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data?.message || "Failed to send message. Please try again.")
            }

            setStatus({
                type: "success",
                message: "Message sent successfully. I'll get back to you soon!",
            })
            form.reset(defaultValues)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong. Please try again."
            setStatus({
                type: "error",
                message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.section
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            id="contact"
            className="w-full py-16 sm:py-24 lg:py-32"
        >
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-8 sm:gap-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center space-y-4"
                    >
                        <motion.p
                            className="text-sm font-semibold uppercase tracking-widest text-primary"
                        >
                            Get in touch
                        </motion.p>
                        <motion.h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent"
                        >
                            Let's build something great together
                        </motion.h2>
                        <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a new idea, an exciting role, or just want to say hi? Drop a message and I'll get back
                            within a day.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Contact Form</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="john@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell me about your project or idea..."
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                                            <p className="text-sm text-muted-foreground">
                                                Prefer email? Reach out at{" "}
                                                <a
                                                    className="font-medium text-primary hover:underline"
                                                    href="mailto:contactme@sandeshs.in"
                                                >
                                                    contactme@sandeshs.in
                                                </a>
                                            </p>
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                                    {isSubmitting ? "Sending..." : "Send message"}
                                                </Button>
                                            </motion.div>
                                        </div>

                                        {status && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`rounded-lg p-4 text-sm ${
                                                    status.type === "success"
                                                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                        : "bg-destructive/10 text-destructive"
                                                }`}
                                                role="status"
                                                aria-live="polite"
                                            >
                                                {status.message}
                                            </motion.div>
                                        )}
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}
