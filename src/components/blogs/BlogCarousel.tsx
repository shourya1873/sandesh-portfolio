"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, ArrowRight } from "lucide-react"

import type { BlogRecord } from "@/types/content"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type BlogCarouselProps = {
    items: BlogRecord[]
}

export function BlogCarousel({ items }: BlogCarouselProps) {
    return (
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent>
                {items.map((blog) => (
                    <CarouselItem key={blog.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
                            <Link href={`/blog/${blog.slug}`}>
                                {blog.coverImage && (
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <Image
                                            src={blog.coverImage}
                                            alt={blog.coverImageAlt ?? blog.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                                    </div>
                                )}
                                <CardHeader className="space-y-2">
                                    {blog.publishedAt && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <time dateTime={blog.publishedAt}>
                                                {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                                            </time>
                                        </div>
                                    )}
                                    <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                                        {blog.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                        Read story
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


