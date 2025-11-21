import { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { LatestProjects } from "@/components/projects/LatestProjects";
import { LatestBlogs } from "@/components/blogs/LatestBlogs";
import { CalEmbed } from "@/components/CalEmbed";
import { generateSEOMetadata, getBaseUrl } from "@/lib/seo";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    ...generateSEOMetadata({
        title: "Sandesh S - Software Developer & Portfolio",
        description: "Welcome to my portfolio! I'm a software developer specializing in web development, full-stack applications, and modern JavaScript frameworks. Explore my projects, read my blog posts, and get in touch.",
        keywords: [
            "software developer",
            "web developer",
            "portfolio",
            "full-stack developer",
            "React developer",
            "Next.js developer",
            "TypeScript",
            "JavaScript",
            "programming",
            "software engineering",
            "web development",
        ],
        canonical: baseUrl,
    }),
};

export default function Home() {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <LatestProjects />
            <LatestBlogs />
            <section className="py-20 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Schedule a meeting</p>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Book a Call</h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">Let's discuss your project or just have a chat</p>
                    </div>
                    <div className="mx-auto max-w-4xl">
                        <CalEmbed />
                    </div>
                </div>
            </section>
            <Contact />
        </>
    );
}
