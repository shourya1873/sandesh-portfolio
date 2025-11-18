'use client';
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Menu, X} from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-background/95 backdrop-blur-sm shadow-md py-4' 
                : 'bg-transparent py-6'
        }`}>
            <div className="flex justify-between items-center mx-6 md:mx-10">
                {/* Logo / Brand */}
                <Link href="/" className="text-xl font-semibold">
                    Sandesh
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden lg:flex gap-10">
                    <li>
                        <Link href="/" className="hover:text-gray-400 transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="#about" className="hover:text-gray-400 transition">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className="hover:text-gray-400 transition">
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link href="/blogs" className="hover:text-gray-400 transition">
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link href="#contact" className="hover:text-gray-400 transition">
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* Desktop Button */}
                <div className="hidden lg:flex">
                    <Link
                        href="#contact"
                        className="px-4 py-2 border border-gray-500 rounded-xl hover:bg-black hover:text-white transition bg-white text-black">
                        Let&apos;s Contact
                    </Link>
                </div>

                {/* Mobile Menu Icons */}
                <div className="lg:hidden flex items-center">
                    {!isOpen ? (
                        <Menu
                            className="cursor-pointer"
                            size={28}
                            onClick={() => setIsOpen(true)}
                        />
                    ) : (
                        <X
                            className="cursor-pointer"
                            size={28}
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                </div>
            </div>

            {/* Mobile Menu Section */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm border-t border-gray-700 flex flex-col items-center gap-6 py-8 text-lg lg:hidden animate-slideDown">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href="#about" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link href="/projects" onClick={() => setIsOpen(false)}>
                        Projects
                    </Link>
                    <Link href="/blogs" onClick={() => setIsOpen(false)}>
                        Blog
                    </Link>
                    <Link href="#contact" onClick={() => setIsOpen(false)}>
                        Contact
                    </Link>
                    <Link
                        href="#contact"
                        onClick={() => setIsOpen(false)}
                        className="border border-gray-500 px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                        Let&apos;s Contact
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
