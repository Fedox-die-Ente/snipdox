import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const sql = usePostgres()
    const id = Number(event.context.params?.id)
    if (!id) throw createError({statusCode: 400, message: 'Invalid user id'})

    await sql`
        DELETE
        FROM users
        WHERE id = ${id}
    `

    return {success: true}
})
