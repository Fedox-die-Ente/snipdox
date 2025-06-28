import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const body = await readBody(event)
    const email = body.email?.toLowerCase()

    if (!email) {
        throw createError({statusCode: 400, message: 'Invalid email'})
    }

    const sql = usePostgres()

    try {
        const [inserted] = await sql`
            INSERT INTO allowed_emails (email)
            VALUES (${email}) RETURNING id, email
        `
        return inserted
    } catch (e: any) {
        if (e.code === '23505') {
            throw createError({statusCode: 400, message: 'Email already exists.'})
        }
        throw createError({statusCode: 500, message: 'Error inserting email.'})
    }
})
