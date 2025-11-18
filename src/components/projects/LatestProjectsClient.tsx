"use client"

import Link from "next/link"
import { motion, useInView } from "motion/react"
import React from "react"

import { ProjectCarousel } from "./ProjectCarousel"
import type { ProjectRecord } from "@/types/content"

export function LatestProjectsClient({ items }: { items: ProjectRecord[] }) {
    const containerRef = React.useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <motion.section
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full py-20 sm:py-32"
        >
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-8 sm:gap-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Recent builds</p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent">
                                Projects
                            </h2>
                            <p className="text-muted-foreground">A collection of my work and case studies</p>
                        </div>
                        <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                View all projects
                                <span aria-hidden="true">→</span>
                            </Link>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <ProjectCarousel items={items} />
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}

