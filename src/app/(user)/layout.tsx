import Navbar from "@/components/generic/Navbar"
import CursorFollower from "@/components/generic/CursorFollower"
import Footer from "@/components/generic/Footer"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CursorFollower />
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

