import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const sql = usePostgres()
    const pastes = await sql`
        SELECT id, user_id, paste_title, language, expiration, created_at, private
        FROM pastes
        ORDER BY created_at DESC
    `
    return pastes
})
