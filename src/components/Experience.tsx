"use client"

import React from "react"
import { motion, useInView } from "motion/react"

const experiences = [
    {
        title: "Associate Software Engineer",
        company: "Codilar Technologies",
        date: "Oct 2019 - Oct 2022",
        description: "Description of the job.",
    },
    {
        title: "Senior Software Engineer",
        company: "Codilar Technologies",
        date: "Oct 2022 - Mar 2025",
        description: "Description of the job.",
    },
    {
        title: "Senior Software Engineer",
        company: "Tech Mahindra",
        date: "Mar 2025 - Present",
        description: "Description of the job.",
    },
]

const Experience = () => {
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
            <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
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
                        className="text-center space-y-4"
                    >
                        <motion.h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent"
                        >
                            My Experience
                        </motion.h2>
                        <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            A timeline of my professional growth and contributions across teams and technologies.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="overflow-x-auto"
                    >
                        <div className="min-w-full">
                            {/* Desktop Table View */}
                            <div className="hidden md:block border rounded-lg overflow-hidden">
                                <div className="bg-muted/50 border-b">
                                    <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm">
                                        <div className="col-span-1">#</div>
                                        <div className="col-span-4">Designation</div>
                                        <div className="col-span-4">Company</div>
                                        <div className="col-span-3">Duration</div>
                                    </div>
                                </div>
                                {experiences.map((experience, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                        className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="grid grid-cols-12 gap-4 p-4 text-sm">
                                            <div className="col-span-1 font-medium">{index + 1}</div>
                                            <div className="col-span-4">{experience.title}</div>
                                            <div className="col-span-4">{experience.company}</div>
                                            <div className="col-span-3 text-muted-foreground">{experience.date}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {experiences.map((experience, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="border rounded-lg p-4 bg-card hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                                            <span className="text-xs text-muted-foreground">{experience.date}</span>
                                        </div>
                                        <h3 className="font-semibold text-base mb-1">{experience.title}</h3>
                                        <p className="text-sm text-muted-foreground">{experience.company}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Experience
