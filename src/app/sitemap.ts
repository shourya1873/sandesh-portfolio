import { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/seo"
import { getBlogsPaginated, getProjectsPaginated } from "@/lib/content"

// Ensure this route is dynamic
export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl()

    // Static pages - always include these
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ]

    // Try to get blogs and projects, but don't fail if database is unavailable
    let blogEntries: MetadataRoute.Sitemap = []
    let projectEntries: MetadataRoute.Sitemap = []

    try {
        // Get all published blogs
        const blogs = await getBlogsPaginated(1, 1000) // Get a large number to fetch all
        blogEntries = blogs.items.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt,
            changeFrequency: blog.publishedAt ? ("monthly" as const) : ("yearly" as const),
            priority: 0.8,
        }))
    } catch (error) {
        console.error("Error fetching blogs for sitemap:", error)
        // Continue without blog entries
    }

    try {
        // Get all published projects
        const projects = await getProjectsPaginated(1, 1000) // Get a large number to fetch all
        projectEntries = projects.items.map((project) => ({
            url: `${baseUrl}/project/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: project.publishedAt ? ("monthly" as const) : ("yearly" as const),
            priority: 0.8,
        }))
    } catch (error) {
        console.error("Error fetching projects for sitemap:", error)
        // Continue without project entries
    }

    return [...staticPages, ...blogEntries, ...projectEntries]
}

