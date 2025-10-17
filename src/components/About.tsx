'use client';
import React from 'react';
import {motion} from "motion/react"
import {Download} from "lucide-react";
import Link from "next/link";

const About = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
            }}
            className={'w-full h-screen pt-20'}
        >
            <motion.div className={'flex flex-col justify-center w-full gap-8'}>
                <motion.h2
                    className={'text-5xl font-bold text-center bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent'}>
                    About Me
                </motion.h2>
                <motion.div className={'px-8 sm:px-18 lg:px-28'}>
                    I’m a Fullstack JavaScript Engineer with 6+ years of professional experience — transitioning from a
                    Magento-based enterprise engineering background to building scalable, modern web applications using
                    the JavaScript stack and Generative AI.
                    <br/>
                    <br/>
                    I&#39;ve delivered both large-scale e-commerce platforms and independent freelance projects using
                    React.js and Node.js, focusing on performance, usability, and clean architecture. I'm now expanding
                    my expertise by integrating Generative AI tools and APIs (like OpenAI, HuggingFace, and LangChain)
                    into real-world web products.
                    <br/>
                    <br/>
                    💡 Key Strengths:
                    <ul className={'px-4'}>
                        <li className="before:content-['-'] before:mr-2 before:text-[#F15E07]">
                            Fullstack Development: React, Node.js, Express, MongoDB, PostgreSQL
                        </li>
                        <li className="before:content-['-'] before:mr-2 before:text-[#F15E07]">
                            GenAI Integration: OpenAI API, LangChain, Vector DBs (Milvus, Pinecone)
                        </li>
                        <li className="before:content-['-'] before:mr-2 before:text-[#F15E07]">
                            DevOps & Infra: Git, Docker, REST APIs, CI/CD (basic)
                        </li>
                    </ul>
                    <br/>
                    🚀 Actively seeking opportunities as a Fullstack Engineer in product-based teams focused on
                    innovation, performance, and user impact.
                </motion.div>
                <motion.div className="flex flex-col items-center gap-4">
                    <Link href={'https://sandeshs.in/'}
                        className="flex gap-2 w-fit bg-gradient-to-r from-[#F15E07] to-[#FF8A00] text-white font-medium px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition">
                        <Download/>
                        Download CV
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
export default About;