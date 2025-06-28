import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const sql = usePostgres()

    const reports = await sql`
        SELECT id, paste_id, ip_address, reason, created_at
        FROM reports
        ORDER BY created_at DESC
    `
    return reports
})
