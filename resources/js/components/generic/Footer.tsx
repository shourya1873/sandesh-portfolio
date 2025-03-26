import {
    Mail,
    MapPin,
    Phone,
    Instagram,
    Linkedin,
    Twitter,
    Facebook, Github, Youtube
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer className="bg-[#0f0f0f] text-white px-6 md:px-12 lg:px-24 py-12 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-semibold">Sandesh S</span>
                    </div>
                    <h2 className="text-2xl font-bold leading-tight">
                        Subscribe to Newsletter
                    </h2>
                    <div className="mt-6">
                        <label htmlFor="email" className="text-md text-gray-400">
                            Email Address
                        </label>
                        <div className="flex items-center border-b border-gray-600 py-2">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-transparent outline-none flex-1 text-md text-white placeholder-gray-500"
                            />
                            <Mail size={16} className="text-gray-400 ml-2" />
                        </div>
                    </div>
                </div>

                {/* Center Section */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Quick Link</h4>
                    <ul className="space-y-2 text-md text-gray-300">
                        <li><Link href={'/#about'}>About Me</Link></li>
                        <li><Link href={'/#about'}>Service</Link></li>
                        <li><Link href={'/#about'}>Contact Us</Link></li>
                        <li><Link href={'/blogs'}>Blogs</Link></li>
                    </ul>
                </div>

                {/* Right Section */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Contact</h4>
                    <ul className="space-y-4 text-md text-gray-300">
                        <li className="flex items-center gap-3">
                          <span className="bg-[#ff014f] p-2 rounded-full">
                            <Mail size={16} />
                          </span>
                            reachoutsandesh@gmail.com
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="bg-[#ff014f] p-2 rounded-full">
                            <MapPin size={16} />
                          </span>
                            Bengaluru
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="bg-[#ff014f] p-2 rounded-full">
                            <Phone size={16} />
                          </span>
                            9060091091
                        </li>
                    </ul>

                    <div className="flex gap-4 mt-6">
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

            {/* Bottom Line */}
            <div
                className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between text-xs text-gray-400">
                <p>© Sandesh S</p>
            </div>
        </footer>
    );
};

export default Footer;
