"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Play } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { ProjectGalleryItem } from "@/server/db/schema"

interface ProjectGalleryProps {
    items: ProjectGalleryItem[]
    youtubeUrl?: string | null
}

export function ProjectGallery({ items, youtubeUrl }: ProjectGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const allItems: (ProjectGalleryItem & { isYoutube?: boolean })[] = [
        ...(youtubeUrl
            ? [
                  {
                      id: "youtube",
                      type: "video" as const,
                      url: youtubeUrl,
                      caption: "Project Video",
                      isYoutube: true,
                  },
              ]
            : []),
        ...items,
    ]

    if (allItems.length === 0) {
        return null
    }

    const selectedItem = selectedIndex !== null ? allItems[selectedIndex] : null

    const openLightbox = (index: number) => {
        setSelectedIndex(index)
        setIsOpen(true)
    }

    const closeLightbox = () => {
        setIsOpen(false)
        setSelectedIndex(null)
    }

    const goToNext = () => {
        if (selectedIndex !== null && selectedIndex < allItems.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
    }

    const goToPrev = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {allItems.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => openLightbox(index)}
                        className="group relative aspect-square overflow-hidden rounded-lg border bg-muted transition-transform hover:scale-105"
                    >
                        {item.type === "image" ? (
                            <Image
                                src={item.url}
                                alt={item.caption || `Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        ) : item.isYoutube ? (
                            <div className="flex h-full items-center justify-center bg-muted">
                                <div className="text-center">
                                    <Play className="mx-auto h-12 w-12 text-primary" />
                                    <p className="mt-2 text-sm font-medium">Watch Video</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                                <Play className="h-12 w-12 text-primary" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </button>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-6xl p-0">
                    {selectedItem && (
                        <div className="relative">
                            <button
                                onClick={closeLightbox}
                                className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {selectedIndex !== null && selectedIndex > 0 && (
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                                >
                                    <span className="sr-only">Previous</span>
                                    ←
                                </button>
                            )}

                            {selectedIndex !== null && selectedIndex < allItems.length - 1 && (
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                                >
                                    <span className="sr-only">Next</span>
                                    →
                                </button>
                            )}

                            <div className="aspect-video w-full">
                                {selectedItem.type === "image" ? (
                                    <Image
                                        src={selectedItem.url}
                                        alt={selectedItem.caption || "Gallery image"}
                                        fill
                                        className="object-contain"
                                    />
                                ) : selectedItem.isYoutube ? (
                                    <iframe
                                        src={selectedItem.url.replace("watch?v=", "embed/").split("&")[0]}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video src={selectedItem.url} controls className="h-full w-full" />
                                )}
                            </div>

                            {selectedItem.caption && (
                                <div className="border-t bg-muted/50 p-4">
                                    <p className="text-sm text-muted-foreground">{selectedItem.caption}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

