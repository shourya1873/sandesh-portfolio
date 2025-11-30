import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const admins = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").default("admin").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export type Admin = typeof admins.$inferSelect

export type RichTextJSON = Record<string, unknown>

export const blogs = pgTable("blogs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    coverImage: text("cover_image"),
    coverImageAlt: text("cover_image_alt"),
    content: jsonb("content").$type<RichTextJSON>().notNull(),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export type Blog = typeof blogs.$inferSelect

export type ProjectGalleryItem = {
    id: string
    type: "image" | "video"
    url: string
    caption?: string
    thumbnail?: string
}

export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    heroImage: text("hero_image"),
    heroImageAlt: text("hero_image_alt"),
    youtubeUrl: text("youtube_url"),
    gallery: jsonb("gallery").$type<ProjectGalleryItem[]>().default([]).notNull(),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export type Project = typeof projects.$inferSelect

export const siteConfig = pgTable("site_config", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    value: text("value"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export type SiteConfig = typeof siteConfig.$inferSelect

export const resources = pgTable("resources", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name").notNull(),
    fileSize: text("file_size"),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
})

export type Resource = typeof resources.$inferSelect


