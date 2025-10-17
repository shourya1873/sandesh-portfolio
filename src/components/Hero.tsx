'use client';
import React from 'react';
import {motion} from "motion/react"
import {MoveDown} from "lucide-react";

const Hero = () => {
    return (
        <motion.div initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                    }}
                    className={
                        "bg-[url('/gr-bg1.webp')] w-full h-screen [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] flex flex-col justify-center items-center gap-10"
                    }>
            <motion.div className={'text-center'}>
                <motion.h6 className={'text-lg lg:text-2xl font-light lg:leading-[1.2em] lg:tracking-[4px]'}>HELLO,</motion.h6>
                <motion.h1 className={'text-[44px] lg:text-[120px] font-medium lg:leading-[1.2em] lg:tracking-[-4.5px]'}>
                    I&#39;am Sandesh
                    <br/>
                    a Web Developer
                </motion.h1>
            </motion.div>
            <motion.div className={'flex flex-col lg:flex-row gap-4 mt-32 justify-between w-full px-4 text-black text-md font-normal'}>
                <motion.div>6+ Years Experience</motion.div>
                <motion.div>Based in Bangalore</motion.div>
                <motion.div className={'flex items-center'}>
                    Scroll Down
                    <MoveDown size={15}/>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
export default Hero;