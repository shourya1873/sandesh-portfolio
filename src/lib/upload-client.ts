"use client"

type UploadFolder = "blogs" | "projects"

export async function uploadMedia(file: File, folder: UploadFolder) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message ?? "Failed to upload file")
    }

    const data = (await response.json()) as { url: string }
    return data.url
}


