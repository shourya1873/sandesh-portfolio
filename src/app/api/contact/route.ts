"use server"

import { NextResponse } from "next/server"
import { z } from "zod"
import nodemailer from "nodemailer"

const contactSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
})

const REQUIRED_ENV_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const

function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key])
    if (missing.length) {
        throw new Error(`Missing SMTP environment variables: ${missing.join(", ")}`)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { fullName, email, message } = contactSchema.parse(body)

        validateEnv()

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`,
            to: "reachoutsandesh@gmail.com",
            replyTo: email,
            subject: `New contact form message from ${fullName}`,
            text: `
Full name: ${fullName}
Email: ${email}

${message}
            `.trim(),
            html: `
                <h2>New contact form submission</h2>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br/>")}</p>
            `,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[contact-form]", error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 })
        }

        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Failed to send message" },
            { status: 500 },
        )
    }
}


