'use client'
import React from 'react';
import {motion} from "motion/react"

const Blogs = () => {
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
                    className={'text-5xl font-bold text-center bg-gradient-to-r from-[#F15E07] to-[#FF8A00] bg-clip-text text-transparent'}>
                    Blogs
                </motion.h2>
            </motion.div>
        </motion.div>
    );
};
export default Blogs;