import { Metadata } from "next"
import type { Blog, Project } from "@/server/db/schema"

// Get base URL from environment or default
export function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    return "https://sandesh.dev" // Update with your actual domain
}

export interface SEOConfig {
    title: string
    description: string
    keywords?: string[]
    image?: string
    type?: "website" | "article" | "profile"
    publishedTime?: string
    modifiedTime?: string
    author?: string
    canonical?: string
    noindex?: boolean
    nofollow?: boolean
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
    const baseUrl = getBaseUrl()
    const canonical = config.canonical || baseUrl
    const imageUrl = config.image ? (config.image.startsWith("http") ? config.image : `${baseUrl}${config.image}`) : `${baseUrl}/og-image.jpg`

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        alternates: {
            canonical: canonical,
        },
        robots: {
            index: !config.noindex,
            follow: !config.nofollow,
            googleBot: {
                index: !config.noindex,
                follow: !config.nofollow,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            type: config.type || "website",
            title: config.title,
            description: config.description,
            url: canonical,
            siteName: "Sandesh S - Portfolio",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: config.title,
                },
            ],
            locale: "en_US",
            ...(config.publishedTime && { publishedTime: config.publishedTime }),
            ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
            ...(config.author && { authors: [config.author] }),
        },
        twitter: {
            card: "summary_large_image",
            title: config.title,
            description: config.description,
            images: [imageUrl],
            creator: "@sandesh", // Update with your Twitter handle
        },
    }
}

export function generateBlogMetadata(blog: Blog): Metadata {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/blog/${blog.slug}`
    const imageUrl = blog.coverImage ? (blog.coverImage.startsWith("http") ? blog.coverImage : `${baseUrl}${blog.coverImage}`) : `${baseUrl}/og-image.jpg`

    return generateSEOMetadata({
        title: blog.title,
        description: blog.excerpt,
        image: imageUrl,
        type: "article",
        canonical: url,
        publishedTime: blog.publishedAt?.toISOString(),
        modifiedTime: blog.updatedAt.toISOString(),
    })
}

export function generateProjectMetadata(project: Project): Metadata {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/project/${project.slug}`
    const imageUrl = project.heroImage ? (project.heroImage.startsWith("http") ? project.heroImage : `${baseUrl}${project.heroImage}`) : `${baseUrl}/og-image.jpg`

    return generateSEOMetadata({
        title: project.title,
        description: project.summary,
        image: imageUrl,
        type: "website",
        canonical: url,
        publishedTime: project.publishedAt?.toISOString(),
    })
}

// Generate Article structured data (JSON-LD) for blog posts
export function generateArticleStructuredData(blog: Blog): object {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/blog/${blog.slug}`
    const imageUrl = blog.coverImage ? (blog.coverImage.startsWith("http") ? blog.coverImage : `${baseUrl}${blog.coverImage}`) : `${baseUrl}/og-image.jpg`

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: imageUrl,
        datePublished: blog.publishedAt?.toISOString(),
        dateModified: blog.updatedAt.toISOString(),
        author: {
            "@type": "Person",
            name: "Sandesh S",
            url: baseUrl,
        },
        publisher: {
            "@type": "Person",
            name: "Sandesh S",
            url: baseUrl,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        url: url,
    }
}

// Generate Project structured data (JSON-LD) for portfolio projects
export function generateProjectStructuredData(project: Project): object {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/project/${project.slug}`
    const imageUrl = project.heroImage ? (project.heroImage.startsWith("http") ? project.heroImage : `${baseUrl}${project.heroImage}`) : `${baseUrl}/og-image.jpg`

    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        image: imageUrl,
        datePublished: project.publishedAt?.toISOString(),
        creator: {
            "@type": "Person",
            name: "Sandesh S",
            url: baseUrl,
        },
        url: url,
        ...(project.youtubeUrl && {
            video: {
                "@type": "VideoObject",
                embedUrl: project.youtubeUrl,
            },
        }),
    }
}

// Generate Person structured data for the portfolio owner
export function generatePersonStructuredData(): object {
    const baseUrl = getBaseUrl()

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Sandesh S",
        url: baseUrl,
        jobTitle: "Software Developer",
        sameAs: [
            // Add your social media profiles here
            // "https://twitter.com/sandesh",
            // "https://github.com/sandesh",
            // "https://linkedin.com/in/sandesh",
        ],
    }
}

// Generate Website structured data
export function generateWebsiteStructuredData(): object {
    const baseUrl = getBaseUrl()

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Sandesh S - Portfolio",
        url: baseUrl,
        description: "Personal portfolio showcasing projects, blog posts, and professional experience",
        publisher: {
            "@type": "Person",
            name: "Sandesh S",
        },
    }
}

// Generate BreadcrumbList structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

// Generate CollectionPage structured data for blog listing
export function generateBlogCollectionStructuredData(): object {
    const baseUrl = getBaseUrl()

    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Blog Posts",
        description: "Latest blog posts and articles about software development, tutorials, and insights",
        url: `${baseUrl}/blogs`,
    }
}

// Generate CollectionPage structured data for project listing
export function generateProjectCollectionStructuredData(): object {
    const baseUrl = getBaseUrl()

    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Portfolio Projects",
        description: "A collection of projects, case studies, and creative solutions",
        url: `${baseUrl}/projects`,
    }
}

