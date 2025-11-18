import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, ArrowRight } from "lucide-react"

import { getProjectsPaginated } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Projects",
    description: "Portfolio projects and case studies",
}

interface ProjectsPageProps {
    searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
    const { page } = await searchParams
    const currentPage = Number(page) || 1
    const { items, total, pages } = await getProjectsPaginated(currentPage, 6)

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <header className="mb-16 text-center">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Portfolio</p>
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">A collection of my work, case studies, and creative solutions</p>
            </header>

            {items.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">No projects yet. Check back soon!</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((project) => (
                            <Card key={project.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                                {project.heroImage && (
                                    <Link href={`/project/${project.slug}`}>
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={project.heroImage}
                                                alt={project.heroImageAlt || project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <CardHeader>
                                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        {project.publishedAt && (
                                            <>
                                                <Calendar className="h-3 w-3" />
                                                <time dateTime={project.publishedAt.toISOString()}>
                                                    {format(new Date(project.publishedAt), "MMM d, yyyy")}
                                                </time>
                                            </>
                                        )}
                                    </div>
                                    <CardTitle className="line-clamp-2">
                                        <Link href={`/project/${project.slug}`} className="hover:underline">
                                            {project.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">{project.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <Link href={`/project/${project.slug}`}>
                                        <Button variant="ghost" className="w-full">
                                            View Project
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {pages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            {currentPage > 1 && (
                                <Link href={`/projects?page=${currentPage - 1}`}>
                                    <Button variant="outline">Previous</Button>
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                                    <Link key={pageNum} href={`/projects?page=${pageNum}`}>
                                        <Button variant={pageNum === currentPage ? "default" : "outline"} size="sm">
                                            {pageNum}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                            {currentPage < pages && (
                                <Link href={`/projects?page=${currentPage + 1}`}>
                                    <Button variant="outline">Next</Button>
                                </Link>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

