'use client'
import React from 'react';
import {motion} from "motion/react" // NOTE: This import should be from 'framer-motion' if using React, but I'll leave it as you provided it: "motion/react"

const experiences = [
    {
        title: 'Associate Software Engineer',
        company: 'Codilar Technologies',
        date: 'Oct 2019 - Oct 2022',
        logo: 'Description of the job.',
    },
    {
        title: 'Senior Software Engineer',
        company: 'Codilar Technologies',
        date: 'Oct 2022 - Mar 2025',
        logo: 'Description of the job.',
    },
    {
        title: 'Senior Software Engineer',
        company: 'Tech Mahindra',
        date: 'Mar 2025 - Present',
        logo: 'Description of the job.',
    }
];

const rowVariants = {
    rest: {},
    hover: {},
};

const underlineVariants = {
    rest: {scaleX: 0, opacity: 0},
    hover: {scaleX: 1, opacity: 1},
};

const Experience = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
            }}
            className={'w-full mt-20'}
        >
            <motion.div className={'flex flex-col w-full gap-8'}>
                <motion.h2
                    className={'text-5xl text-center font-bold bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent px-8 sm:px-18 lg:px-28'}>
                    My Experience
                </motion.h2>
                <motion.h4 className={'text-center text-lg font-normal px-8 sm:px-18 lg:px-28'}>
                    A timeline of my professional growth and contributions across teams and technologies.
                </motion.h4>
                {/* Adjusted padding to visually move the content slightly right from the edge */}
                <motion.div className={'px-8 sm:px-18 lg:px-28'}>
                    <motion.div
                        initial={{x: -100, opacity: 0}} // start position (off-screen left)
                        animate={{x: 0, opacity: 1}}    // final position
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                        className=""
                    >
                        <motion.div className={'border-b'}>
                            <motion.div className={'pb-3 flex justify-start font-bold'}>
                                <motion.div className={'w-[20%]'}>
                                    #
                                </motion.div>
                                <motion.div className={'w-[30%]'}>
                                    Designation
                                </motion.div>
                                <motion.div className={'w-[30%]'}>
                                    Company
                                </motion.div>
                                <motion.div className={'w-[20%]'}>
                                    Duration
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        {experiences.map((experience, index) => (
                            <motion.div
                                className={'border-b hover:border-[#F15E07] hover:transition hover:ease-out hover:duration-500'}
                                key={index}>
                                <motion.div className={'py-3 flex justify-start'}>
                                    <motion.div className={'w-[20%] text-sm'}> {/* Small width for index */}
                                        {index + 1}
                                    </motion.div>
                                    <motion.div className={'w-[30%] text-sm'}> {/* Larger width for title */}
                                        {experience.title}
                                    </motion.div>
                                    <motion.div className={'w-[30%] text-sm'}> {/* Medium width for company */}
                                        {experience.company}
                                    </motion.div>
                                    <motion.div className={'w-[20%] text-sm'}> {/* Smaller width for date */}
                                        {experience.date}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
export default Experience;