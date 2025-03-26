import { ArrowRight, Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { Button } from './ui/button';

const Hero = () => {
    return (
        <section className={`linear-gradient-primary h-screen w-full`}>
            <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="left flex w-full lg:w-1/2 flex-col gap-1">
                    <h2 className="color-pink text-xl leading-6 font-bold tracking-[4px]">I AM</h2>
                    <h1 className="text-6xl font-bold">Sandesh S,</h1>
                    <TypeAnimation
                        sequence={['Frontend Developer', 1000, 'Backend Developer', 1000, 'Full Stack Developer', 1000]}
                        wrapper="span"
                        speed={50}
                        style={{ fontSize: '54px' }}
                        repeat={Infinity}
                        className="color-pink font-bold"
                    />
                    <div className="text-lg leading-6 text-gray-300">
                        I assist individuals and brands in achieving their objectives by creating and developing user-focused digital products and
                        interactive experiences.
                    </div>
                    <div className="mt-8">
                        <Button className="background-pink h-[60px] w-[200px] rounded-full text-lg font-bold text-white">
                            More About Me <ArrowRight />
                        </Button>
                    </div>
                    <div className="mt-8 flex flex-col gap-2">
                        <div>Find me on</div>
                        <div className="hidden space-x-2 md:flex">
                            <a
                                href="https://www.instagram.com/codewithsandesh/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1A1A1A]"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/sandeshshivakumar/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1A1A1A]"
                            >
                                <Linkedin size={16} fill="white" />
                            </a>
                            <a
                                href="https://x.com/imsandesh18/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1A1A1A]"
                            >
                                <Twitter size={16} fill="white" />
                            </a>
                            <a
                                href="https://github.com/shourya1873/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1A1A1A]"
                            >
                                <Github size={16} fill="white" />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCPz-HYMRx3K5-8V8nKpGZUg"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1A1A1A]"
                            >
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="right w-1/2">
                    <div className="h-5[30rem] w-[30rem] hidden lg:block">
                        <img src="/images/hero.webp" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
