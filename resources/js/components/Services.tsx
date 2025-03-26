import {
    MonitorSmartphone,
    Smartphone,
    LayoutDashboard,
    Database,
    ShieldCheck,
    Users,
} from 'lucide-react';

const services = [
    {
        title: 'Full-Stack Web Development',
        description:
            'Building robust and scalable web applications using modern JavaScript frameworks and backend APIs.',
        icon: <LayoutDashboard className="w-8 h-8 text-sky-500" />,
    },
    {
        title: 'Cross-Platform Mobile Apps',
        description:
            'Developing high-performance mobile apps using React Native or Flutter with seamless user experience.',
        icon: <Smartphone className="w-8 h-8 text-indigo-500" />,
    },
    {
        title: 'System Architecture & API Design',
        description:
            'Designing scalable, secure backend systems and RESTful APIs with clear documentation and versioning.',
        icon: <Database className="w-8 h-8 text-emerald-500" />,
    },
    {
        title: 'DevOps & CI/CD Integration',
        description:
            'Automating deployments, monitoring performance, and maintaining environments using Docker, GitHub Actions, and cloud platforms.',
        icon: <ShieldCheck className="w-8 h-8 text-yellow-400" />,
    },
    {
        title: 'Tech Consulting & Mentorship',
        description:
            'Advising teams on code quality, project structure, performance optimization, and leading engineering best practices.',
        icon: <Users className="w-8 h-8 text-pink-500" />,
    },
    {
        title: 'Responsive UI Engineering',
        description:
            'Crafting clean, accessible, and responsive interfaces using Tailwind CSS, component libraries, and design systems.',
        icon: <MonitorSmartphone className="w-8 h-8 text-red-400" />,
    },
];


export default function ServicesSection() {
    return (
        <section className="bg-black text-white py-16 px-6 lg:px-24">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Our Services</h2>
                <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                    From idea to execution — we bring your vision to life with creativity, technology, and precision.
                </p>

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-pink-500/20"
                        >
                            <div className="mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2 group-hover:text-pink-500 transition-colors">{service.title}</h3>
                            <p className="text-gray-400 text-md">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
