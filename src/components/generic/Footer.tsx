'use client';
import React from 'react';
import {motion} from "motion/react"
import {FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon} from "lucide-react";
import Link from "next/link";

const Footer = () => {
    const marquee = {
        animate: {
            x: ["10%", "-100%"],
        },
    };
    const speed = 50;
    const sizeClass = "text-6xl md:text-8xl lg:text-9xl";

    return (
        <motion.footer initial={{opacity: 0, y: 50}}
                       animate={{opacity: 1, y: 0}}
                       transition={{
                           duration: 0.6,
                           ease: 'easeOut',
                       }}
                       className={
                           "bg-[url('/gr-bg1.webp')] w-full [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] flex flex-col gap-10 mt-20 pb-40"
                       }>
            <motion.div className={'w-full overflow-hidden'}>
                <motion.div
                    aria-hidden={false}
                    aria-label="Let's work together"
                    className="relative w-full flex items-center"
                >
                    {/* a repeating wrapper helps keep the text visually continuous if desired */}
                    <motion.div
                        variants={marquee}
                        animate="animate"
                        transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "linear",
                            duration: speed,
                        }}
                        // pause animation on hover
                        whileHover={{scale: 1.01}}
                        className="inline-flex whitespace-nowrap gap-16"
                        style={{willChange: "transform"}}
                    >
                        {/* Repeat twice so there's no empty gap during scroll */}
                        {[0, 1].map((n) => (
                            <div key={n} className="inline-flex items-center gap-6">
                                {/* LET'S - outlined text */}
                                <span
                                    className={`font-extrabold ${sizeClass} leading-none select-none`}
                                    style={{
                                        color: "transparent",
                                        WebkitTextStroke: "1px rgba(255,255,255,0.7)", // subtle outline
                                    }}
                                >
                LET&apos;S
              </span>

                                {/* WORK - gradient filled */}
                                <span
                                    className={`font-extrabold ${sizeClass} leading-none select-none bg-clip-text text-white`}
                                >
                WORK
              </span>

                                {/* TOGETHER - outlined text */}
                                <span
                                    className={`font-extrabold ${sizeClass} leading-none select-none`}
                                    style={{
                                        color: "transparent",
                                        WebkitTextStroke: "1px rgba(255,255,255,0.7)",
                                    }}
                                >
                TOGETHER
              </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div className={'px-4 flex justify-around'}>
                <div className={'flex gap-2'}>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://x.com/imsandesh18'}>
                            <TwitterIcon className={'w-4'}/>
                        </Link>
                    </div>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://www.facebook.com/sandesh.s.303348'}>
                            <FacebookIcon className={'w-4'}/>
                        </Link>
                    </div>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://www.instagram.com/sandesh_06/'}>
                            <InstagramIcon className={'w-4'}/>
                        </Link>
                    </div>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://www.linkedin.com/in/sandeshshivakumar/'}>
                            <LinkedinIcon className={'w-4'}/>
                        </Link>
                    </div>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://www.youtube.com/@code-with-sandesh'}>
                            <YoutubeIcon className={'w-4'}/>
                        </Link>
                    </div>
                    <div className={'w-10 h-10 rounded-full flex items-center border-[1px] justify-center hover:bg-[#F15E07] hover:text-white hover:transition hover:ease-out hover:duration-500'}>
                        <Link href={'https://github.com/shourya1873'}>
                            <GithubIcon className={'w-4'}/>
                        </Link>
                    </div>
                </div>
                <div>
                    <ul>
                        <li className="before:content-['-'] before:mr-2 before:text-[#F15E07]">
                            Bangalore, IN
                        </li>
                        <li className="before:content-['-'] before:mr-2 before:text-[#F15E07]">
                            reachoutsandesh@gmail.com
                        </li>
                    </ul>
                </div>
            </motion.div>
        </motion.footer>
    );
};
export default Footer;