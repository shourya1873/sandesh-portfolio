import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { getPublishedBlogBySlug } from "@/lib/content"
import { BlogRenderer } from "@/components/blogs/BlogRenderer"
import { Button } from "@/components/ui/button"

interface BlogPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps) {
    const { slug } = await params
    const blog = await getPublishedBlogBySlug(slug)

    if (!blog) {
        return {
            title: "Blog Not Found",
        }
    }

    return {
        title: blog.title,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: blog.coverImage ? [blog.coverImage] : [],
        },
    }
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { slug } = await params
    const blog = await getPublishedBlogBySlug(slug)

    if (!blog) {
        notFound()
    }

    return (
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <Link href="/blogs">
                <Button variant="ghost" className="mb-8 group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Blogs
                </Button>
            </Link>

            <header className="mb-12">
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{blog.title}</h1>
                <p className="mb-8 text-xl leading-relaxed text-muted-foreground">{blog.excerpt}</p>

                {blog.coverImage && (
                    <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border shadow-lg">
                        <Image
                            src={blog.coverImage}
                            alt={blog.coverImageAlt || blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 border-b pb-6 text-sm text-muted-foreground">
                    {blog.publishedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={blog.publishedAt.toISOString()}>
                                {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                            </time>
                        </div>
                    )}
                </div>
            </header>

            <div className="blog-content prose prose-lg dark:prose-invert max-w-none">
                <BlogRenderer content={blog.content} />
            </div>
        </article>
    )
}

