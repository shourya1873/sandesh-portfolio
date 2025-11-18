import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

type UploadFolder = "blogs" | "projects" | "general"

export async function saveUploadedFile(file: File, folder: UploadFolder) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsRoot = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadsRoot, { recursive: true })

    const ext = file.name?.split(".").pop() ?? "bin"
    const filename = `${Date.now()}-${randomUUID()}.${ext}`

    const filepath = path.join(uploadsRoot, filename)
    await writeFile(filepath, buffer)

    return `/uploads/${folder}/${filename}`
}


