'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {Menu, X} from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center mx-6 md:mx-10 my-6 relative">
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
                    <Link href="#works" className="hover:text-gray-400 transition">
                        Works
                    </Link>
                </li>
                <li>
                    <Link href="#service" className="hover:text-gray-400 transition">
                        Service
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

            {/* Mobile Menu Section */}
            {isOpen && (
                <div
                    className="absolute top-14 left-0 w-full bg-[#0a0a0a] border-t border-gray-700 flex flex-col items-center gap-6 py-8 text-lg z-50 lg:hidden animate-slideDown">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href="#about" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link href="#works" onClick={() => setIsOpen(false)}>
                        Works
                    </Link>
                    <Link href="#service" onClick={() => setIsOpen(false)}>
                        Service
                    </Link>
                    <Link
                        href="#contact"
                        onClick={() => setIsOpen(false)}
                        className="border border-gray-500 px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                    >
                        Let&apos;s Contact
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
