import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    
    const sql = usePostgres()
    const result = await sql`SELECT id, email
                             FROM allowed_emails
                             ORDER BY email ASC`
    return result
})
