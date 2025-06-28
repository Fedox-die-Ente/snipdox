import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const id = Number(event.context.params?.id)

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Invalid allowed email id',
        })
    }

    const sql = usePostgres()
    await sql`DELETE
              FROM allowed_emails
              WHERE id = ${id}`

    return {success: true}
})