"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "superadmin"]).default("admin"),
})

const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    role: z.enum(["admin", "superadmin"]).default("admin"),
})

export type AdminUserFormValues = z.infer<typeof createUserSchema>

type AdminUserFormProps = {
    initialValues?: Partial<AdminUserFormValues> & { id?: string }
    onSubmit: (values: AdminUserFormValues) => Promise<void>
    submitLabel?: string
    isEditing?: boolean
}

export function AdminUserForm({ initialValues, onSubmit, submitLabel = "Save user", isEditing = false }: AdminUserFormProps) {
    const schema = isEditing ? updateUserSchema : createUserSchema

    const form = useForm<AdminUserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialValues?.name ?? "",
            email: initialValues?.email ?? "",
            password: "",
            role: (initialValues?.role as "admin" | "superadmin") ?? "admin",
        },
    })

    const handleSubmit = async (values: AdminUserFormValues) => {
        // If editing and password is empty, remove it from submission
        if (isEditing && !values.password) {
            const { password, ...rest } = values
            await onSubmit(rest as AdminUserFormValues)
        } else {
            await onSubmit(values)
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Admin name" {...field} />
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
                                <Input type="email" placeholder="admin@example.com" {...field} />
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
                                <Input type="password" placeholder={isEditing ? "Leave blank to keep current password" : "Password (min 6 characters)"} {...field} />
                            </FormControl>
                            <FormDescription>
                                {isEditing ? "Leave blank to keep the current password. Enter a new password to change it." : "Password must be at least 6 characters long."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="superadmin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>The role determines the user's permissions.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

