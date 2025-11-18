import Link from "next/link"

import { getLatestProjects } from "@/lib/content"
import { ProjectCarousel } from "./ProjectCarousel"
import { LatestProjectsClient } from "./LatestProjectsClient"
import type { ProjectRecord } from "@/types/content"

export async function LatestProjects() {
    const projects = await getLatestProjects(6)

    if (!projects.length) return null

    const serialized: ProjectRecord[] = projects.map((project) => ({
        ...project,
        heroImage: project.heroImage ?? null,
        heroImageAlt: project.heroImageAlt ?? null,
        youtubeUrl: project.youtubeUrl ?? null,
        publishedAt: project.publishedAt?.toISOString() ?? null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
    }))

    return <LatestProjectsClient items={serialized} />
}
