import { NextResponse } from "next/server"

import { saveUploadedFile } from "@/lib/uploads"

const allowedFolders = new Set(["blogs", "projects", "general"])

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get("file")
    const folder = (formData.get("folder") as string) || "general"

    if (!(file instanceof File)) {
        return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    if (!allowedFolders.has(folder)) {
        return NextResponse.json({ message: "Invalid folder" }, { status: 400 })
    }

    try {
        const url = await saveUploadedFile(file, folder as "blogs" | "projects" | "general")
        return NextResponse.json({ url })
    } catch (error) {
        console.error("[upload]", error)
        return NextResponse.json({ message: "Failed to upload file" }, { status: 500 })
    }
}


