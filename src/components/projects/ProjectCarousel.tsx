"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, ArrowRight } from "lucide-react"

import type { ProjectRecord } from "@/types/content"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ProjectCarouselProps = {
    items: ProjectRecord[]
}

export function ProjectCarousel({ items }: ProjectCarouselProps) {
    return (
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent>
                {items.map((project) => (
                    <CarouselItem key={project.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
                            <Link href={`/project/${project.slug}`}>
                                {project.heroImage && (
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <Image
                                            src={project.heroImage}
                                            alt={project.heroImageAlt ?? project.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                                    </div>
                                )}
                                <CardHeader className="space-y-2">
                                    {project.publishedAt && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <time dateTime={project.publishedAt}>
                                                {format(new Date(project.publishedAt), "MMM d, yyyy")}
                                            </time>
                                        </div>
                                    )}
                                    <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3">{project.summary}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                        Explore case study
                                        <ArrowRight className="ml-0 h-4 w-4 group-hover:ml-2 transition-all" />
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
        </Carousel>
    )
}


