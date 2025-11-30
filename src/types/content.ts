export type BlogRecord = {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string | null
    coverImageAlt: string | null
    content: Record<string, unknown>
    status: "draft" | "published"
    publishedAt: string | null
    createdAt: string
    updatedAt: string
}

export type ProjectGalleryItem = {
    id: string
    type: "image" | "video"
    url: string
    caption?: string | null
    thumbnail?: string | null
}

export type ProjectRecord = {
    id: string
    title: string
    slug: string
    summary: string
    description: string
    heroImage: string | null
    heroImageAlt: string | null
    youtubeUrl: string | null
    gallery: ProjectGalleryItem[]
    status: "draft" | "published"
    publishedAt: string | null
    createdAt: string
    updatedAt: string
}

export type ResourceRecord = {
    id: string
    title: string
    description: string | null
    fileUrl: string
    fileName: string
    fileSize: string | null
    status: "active" | "inactive"
    createdAt: string
    updatedAt: string
}


