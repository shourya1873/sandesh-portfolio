"use client"

import React from "react"
import { motion, useInView } from "motion/react"
import { Download } from "lucide-react"
import Link from "next/link"

const About = () => {
    const containerRef = React.useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <motion.section
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            id="about"
            className="w-full min-h-screen py-20 sm:py-32 flex items-center"
        >
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col gap-8 sm:gap-12"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent"
                    >
                        About Me
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4 text-base sm:text-lg leading-relaxed text-foreground/90"
                    >
                        <p>
                            I&apos;m a Fullstack JavaScript Engineer with 6+ years of professional experience — transitioning from a
                            Magento-based enterprise engineering background to building scalable, modern web applications using
                            the JavaScript stack and Generative AI.
                        </p>
                        <p>
                            I&apos;ve delivered both large-scale e-commerce platforms and independent freelance projects using
                            React.js and Node.js, focusing on performance, usability, and clean architecture. I&apos;m now expanding
                            my expertise by integrating Generative AI tools and APIs (like OpenAI, HuggingFace, and LangChain)
                            into real-world web products.
                        </p>

                        <div className="pt-4">
                            <p className="font-semibold mb-3 text-lg">💡 Key Strengths:</p>
                            <ul className="space-y-2 pl-4">
                                {[
                                    "Fullstack Development: React, Node.js, Express, MongoDB, PostgreSQL",
                                    "GenAI Integration: OpenAI API, LangChain, Vector DBs (Milvus, Pinecone)",
                                    "DevOps & Infra: Git, Docker, REST APIs, CI/CD (basic)",
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                        className="flex items-start gap-2 before:content-['-'] before:text-[#F15E07] before:font-bold"
                                    >
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex justify-center pt-4"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="https://sandeshs.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 w-fit bg-gradient-to-r from-[#F15E07] to-[#FF8A00] text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <Download size={20} />
                                Download CV
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default About
