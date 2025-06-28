import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const sql = usePostgres()
    return await sql`SELECT id, username, email, admin
                     FROM users
                     ORDER BY id`
})
