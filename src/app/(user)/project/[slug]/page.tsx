import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { getPublishedProjectBySlug } from "@/lib/content"
import { ProjectGallery } from "@/components/projects/ProjectGallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateProjectMetadata, generateProjectStructuredData, generateBreadcrumbStructuredData, getBaseUrl } from "@/lib/seo"

interface ProjectPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params
    const project = await getPublishedProjectBySlug(slug)

    if (!project) {
        return {
            title: "Project Not Found",
        }
    }

    return generateProjectMetadata(project)
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params
    const project = await getPublishedProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    const baseUrl = getBaseUrl()
    const projectStructuredData = generateProjectStructuredData(project)
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
        { name: "Home", url: baseUrl },
        { name: "Projects", url: `${baseUrl}/projects` },
        { name: project.title, url: `${baseUrl}/project/${project.slug}` },
    ])

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
            />
            <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <Link href="/projects">
                    <Button variant="ghost" className="mb-8 group">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Projects
                    </Button>
                </Link>

                <header className="mb-12">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
                    <p className="mb-8 text-xl leading-relaxed text-muted-foreground">{project.summary}</p>

                    {project.heroImage && (
                        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border shadow-lg">
                            <Image
                                src={project.heroImage}
                                alt={project.heroImageAlt || project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 border-b pb-6">
                        {project.publishedAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={project.publishedAt.toISOString()}>
                                    {format(new Date(project.publishedAt), "MMMM d, yyyy")}
                                </time>
                            </div>
                        )}
                        <Badge variant="secondary">{project.status}</Badge>
                    </div>
                </header>

                <div className="mb-12 space-y-12">
                    <div>
                        <h2 className="mb-6 text-3xl font-semibold tracking-tight">About This Project</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="whitespace-pre-line leading-relaxed">{project.description}</p>
                        </div>
                    </div>

                    {(project.youtubeUrl || project.gallery.length > 0) && (
                        <div>
                            <h2 className="mb-6 text-3xl font-semibold tracking-tight">Gallery</h2>
                            <ProjectGallery items={project.gallery} youtubeUrl={project.youtubeUrl} />
                        </div>
                    )}
                </div>
            </article>
        </>
    )
}

