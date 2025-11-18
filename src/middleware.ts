import { NextResponse, type NextRequest } from "next/server"

import { verifyAdminToken } from "@/lib/jwt"

const PUBLIC_ADMIN_PATHS = ["/admin/login"]

function isPublicAdminPath(pathname: string) {
    return PUBLIC_ADMIN_PATHS.some((path) => pathname === path)
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!pathname.startsWith("/admin")) {
        return NextResponse.next()
    }

    const token = request.cookies.get("admin_token")?.value

    if (isPublicAdminPath(pathname)) {
        if (token) {
            try {
                await verifyAdminToken(token)
                return NextResponse.redirect(new URL("/admin", request.url))
            } catch {
                return NextResponse.next()
            }
        }
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
        await verifyAdminToken(token)
        return NextResponse.next()
    } catch {
        const response = NextResponse.redirect(new URL("/admin/login", request.url))
        response.cookies.set({
            name: "admin_token",
            value: "",
            maxAge: 0,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
        })
        return response
    }
}

export const config = {
    matcher: ["/admin/:path*"],
}


