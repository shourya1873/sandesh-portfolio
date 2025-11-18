#!/usr/bin/env tsx
import "dotenv/config"
import inquirer from "inquirer"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import { admins } from "../src/server/db/schema"
import { db } from "../src/server/db"

async function main() {
    console.log("\n🧑‍💻  Create New Admin\n")

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter admin name:",
            validate: (val: string) => val.trim() !== "" || "Name is required",
        },
        {
            type: "input",
            name: "email",
            message: "Enter admin email:",
            validate: (val: string) => /\S+@\S+\.\S+/.test(val) || "Please enter a valid email address",
        },
        {
            type: "password",
            name: "password",
            message: "Enter admin password:",
            mask: "*",
            validate: (val: string) => val.length >= 6 || "Password must be at least 6 characters",
        },
    ])

    const existing = await db.query.admins.findFirst({
        where: eq(admins.email, answers.email),
    })

    if (existing) {
        console.log(`\n⚠️  Admin with email ${answers.email} already exists.`)
        process.exit(1)
    }

    const passwordHash = await bcrypt.hash(answers.password, 10)

    const inserted = await db
        .insert(admins)
        .values({
            name: answers.name,
            email: answers.email,
            passwordHash,
            role: "admin",
        })
        .returning({
            id: admins.id,
            name: admins.name,
            email: admins.email,
            role: admins.role,
        })

    console.log("\n✅ Admin created successfully:\n", inserted[0])
}

main().then(() => process.exit(0))

