'use client'
import React from 'react';
import {motion} from "motion/react"
import SkillsCard from "@/components/Card";

const skills = [
    {
        name: 'React',
        image: '/react.svg',
    },
    {
        name: 'Node.js',
        image: '/node.svg',
    },
    {
        name: 'Mongo',
        image: '/mongo.svg',
    },
    {
        name: 'MySQL',
        image: '/mysql.svg',
    },
    {
        name: 'Php',
        image: '/php.svg',
    },
    {
        name: 'Next.js',
        image: '/nextjs.svg',
    },
    {
        name: 'Python',
        image: '/python.svg',
    },
    {
        name: 'Docker',
        image: '/docker.svg',
    },
    {
        name: 'Pinecone',
        image: '/pinecone.svg',
    },
    {
        name: 'LangChain',
        image: '/langchain.svg',
    },
]

const Skills = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
            }}
            className={'w-full'}
        >
            <motion.div className={'flex flex-col w-full gap-8'}>
                <motion.h2
                    className={'text-5xl font-bold text-center bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent'}>
                    My Skills
                </motion.h2>
                <motion.div className={'px-8 sm:px-18 lg:px-28'}>
                    <motion.div className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4'}>
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            whileHover={{
                                scale: 1.03,
                                y: -4,
                            }}
                            transition={{ type: "spring", stiffness: 250, damping: 15 }}
                        >
                            <SkillsCard name={skill.name} image={skill.image}/>
                        </motion.div>
                    ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
export default Skills;