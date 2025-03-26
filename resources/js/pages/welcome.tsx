import About from '@/components/About';
import ExperienceEducation from '@/components/ExperienceEducation';
import Hero from '@/components/Hero';
import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';
import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react'
import ServicesSection from '@/components/Services';
import Contact from '@/components/Contact';

export default function Welcome() {
    const [visibleLetters, setVisibleLetters] = useState(0);
    const textRef = useRef(null);

    const textContent =
        'Passionate Full-Stack & E-Commerce Developer with over 5+ years of experience building scalable and high-performance applications. I specialize in Magento, MERN stack, and Next.js, with deep expertise in React Native and Expo for mobile app development';

    const letters = textContent.split('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Start the letter-by-letter animation
                    let count = 0;
                    const totalLetters = letters.length;

                    const interval = setInterval(() => {
                        setVisibleLetters((prev) => {
                            const next = prev + 1;
                            if (next >= totalLetters) {
                                clearInterval(interval);
                            }
                            return next;
                        });

                        count++;
                        if (count >= totalLetters) {
                            clearInterval(interval);
                        }
                    }, 80); // Adjust speed of text reveal here

                    // Once started, disconnect observer
                    if (textRef.current) {
                        observer.unobserve(textRef.current);
                    }
                }
            },
            { threshold: 0.2 }, // Trigger when 20% of the element is visible
        );

        if (textRef.current) {
            observer.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, [letters.length]);

    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Delay to ensure DOM is loaded
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <StoreFrontLayout>
            <Head>
                <title>Sandesh S - Portfolio</title>
                <meta name="description" content="My personal portfolio" />
            </Head>
            <Hero />
            <div className="flex items-center justify-center bg-black p-4">
                <div ref={textRef} className="my-22 max-w-7xl text-center text-3xl leading-[1.25] font-bold md:text-5xl">
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            className={`transition-colors duration-300 ${index < visibleLetters ? 'text-white' : 'text-transparent'}`}
                            style={{ WebkitTextStroke: '1px #ffffff' }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            </div>
            <About />
            <ExperienceEducation />
            <ServicesSection />
            <Contact />
        </StoreFrontLayout>
    );
}
