"use client"

import React from "react"
import { motion, useInView } from "motion/react"
import SkillsCard from "@/components/Card"

const skills = [
    { name: "React", image: "/react.svg" },
    { name: "Node.js", image: "/node.svg" },
    { name: "Mongo", image: "/mongo.svg" },
    { name: "MySQL", image: "/mysql.svg" },
    { name: "Php", image: "/php.svg" },
    { name: "Next.js", image: "/nextjs.svg" },
    { name: "Python", image: "/python.svg" },
    { name: "Docker", image: "/docker.svg" },
    { name: "Pinecone", image: "/pinecone.svg" },
    { name: "LangChain", image: "/langchain.svg" },
]

const Skills = () => {
    const containerRef = React.useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    return (
        <motion.section
            ref={containerRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full py-20 sm:py-32"
        >
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-8 sm:gap-12"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent"
                    >
                        My Skills
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
                    >
                        {skills.map((skill, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        y: -8,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <SkillsCard name={skill.name} image={skill.image} />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Skills
