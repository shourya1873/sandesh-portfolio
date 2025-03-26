import { ChevronDown, Github, Instagram, Linkedin, Menu, Twitter, X, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

const menuItems = [
    {
        title: 'Home',
        link: '/'
    },
    {
        title: 'About',
        link: '/#about'
    },
    {
        title: 'Blog',
        link: '/blogs'
    },
    {
        title: 'Projects',
        link: '/projects'
    },
    {
        title: 'Contact',
        link: '/contact'
    }
];

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-800' : ''
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href={'/'} className="text-2xl font-bold">Sandesh S</Link>

                    {/* Desktop Menu */}
                    <div className="hidden space-x-6 md:flex">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="group relative"
                                onMouseEnter={() => item?.subItems && setActiveMenu(index)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <Link href={item?.link}
                                   className="flex cursor-pointer items-center space-x-1 px-4 py-2 font-bold hover:text-[#ff014f]">
                                    {item.title} {item?.subItems && <ChevronDown size={16} />}
                                </Link>
                                {activeMenu === index && item?.subItems && (
                                    <div
                                        className="absolute left-0 mt-2 w-48 rounded-md border border-gray-200 p-2 shadow-lg">
                                        {item?.subItems?.map((subItem, subIndex) => (
                                            <Link key={subIndex} href={subItem.link}
                                               className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600">
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute w-full border-t border-gray-200 bg-gray-800 p-4 md:hidden">
                    {menuItems.map((item, index) => (
                        <div key={index} className="mb-2">
                            <Link
                                className="flex w-full items-center justify-between py-2 font-medium"
                                href={item?.link}
                            >
                                {item.title} {item?.subItems && <ChevronDown size={16} />}
                            </Link>
                            {activeMenu === index && item?.subItems && (
                                <div className="mt-1 pl-4">
                                    {item?.subItems?.map((subItem, subIndex) => (
                                        <Link key={subIndex} href={subItem.link}
                                           className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600">
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}
