import { Pool } from "pg"
import { readFileSync } from "fs"
import { join } from "path"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

async function main() {
    try {
        const migrationSQL = readFileSync(join(process.cwd(), "drizzle", "0003_swift_taskmaster.sql"), "utf-8")
        
        console.log("Applying migration...")
        await pool.query(migrationSQL)
        
        console.log("✓ Migration applied successfully!")
    } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
            console.log("✓ Resources table already exists. Migration skipped.")
        } else {
            console.error("✗ Migration failed:", error)
            process.exit(1)
        }
    } finally {
        await pool.end()
    }
}

main()

