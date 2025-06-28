import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const sql = usePostgres()
    const id = Number(event.context.params?.id)
    if (!id) throw createError({statusCode: 400, message: 'Invalid user id'})

    const body = await readBody(event)
    const username = typeof body.username === 'string' ? body.username.trim() : null
    const admin = body.admin === true

    if (!username || username.length === 0) {
        throw createError({statusCode: 400, message: 'Username cannot be null'})
    }

    await sql`
        UPDATE users
        SET username = ${username},
            admin    = ${admin}
        WHERE id = ${id}
    `

    return {success: true}
})
