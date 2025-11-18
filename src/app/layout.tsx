import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import { AnalyticsScripts } from "@/components/AnalyticsScripts"
import { Toaster } from "sonner"

const bricolageGrotesque = Bricolage_Grotesque({
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: {
        default: "Sandesh S",
        template: "%s | Sandesh S",
    },
    description: "Personal Portfolio",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${bricolageGrotesque.className} antialiased`}>
                <AnalyticsScripts />
                {children}
                <Toaster />
            </body>
        </html>
    )
}
