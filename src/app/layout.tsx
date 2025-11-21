import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import { AnalyticsScripts } from "@/components/AnalyticsScripts"
import { Toaster } from "sonner"
import { getBaseUrl, generateWebsiteStructuredData, generatePersonStructuredData } from "@/lib/seo"

const bricolageGrotesque = Bricolage_Grotesque({
    subsets: ["latin"],
    display: "swap",
    preload: true,
})

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Sandesh S - Software Developer & Portfolio",
        template: "%s | Sandesh S",
    },
    description: "Personal portfolio showcasing software development projects, blog posts, and professional experience. Explore my work in web development, full-stack applications, and technical insights.",
    keywords: [
        "software developer",
        "web developer",
        "portfolio",
        "full-stack developer",
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "programming",
        "software engineering",
    ],
    authors: [{ name: "Sandesh S", url: baseUrl }],
    creator: "Sandesh S",
    publisher: "Sandesh S",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: baseUrl,
    },
    openGraph: {
        type: "website",
        title: "Sandesh S - Software Developer & Portfolio",
        description: "Personal portfolio showcasing software development projects, blog posts, and professional experience. Explore my work in web development, full-stack applications, and technical insights.",
        url: baseUrl,
        siteName: "Sandesh S - Portfolio",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sandesh S - Software Developer & Portfolio",
        description: "Personal portfolio showcasing software development projects, blog posts, and professional experience.",
        creator: "@sandesh", // Update with your Twitter handle
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const websiteStructuredData = generateWebsiteStructuredData()
    const personStructuredData = generatePersonStructuredData()

    return (
        <html lang="en" className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
                />
            </head>
            <body className={`${bricolageGrotesque.className} antialiased`}>
                <AnalyticsScripts />
                {children}
                <Toaster />
            </body>
        </html>
    )
}
