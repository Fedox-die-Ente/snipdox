import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const id = event.context.params?.id
    if (!id) throw createError({statusCode: 400, message: 'ReportID is required.'})

    const sql = usePostgres()
    await sql`DELETE
              FROM reports
              WHERE id = ${id}`

    return {success: true}
})
