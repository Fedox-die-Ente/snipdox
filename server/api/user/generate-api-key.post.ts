import {getServerSession} from "#auth"
import {getUserByEmail} from "~/server/actions/user.action"

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)

    if (!session?.user?.email) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to generate an API key.",
        })
    }

    const user = await getUserByEmail(session.user.email)

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "User not found.",
        })
    }

    if (user.api_key) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "User already has an API key. Use reset instead.",
        })
    }

    const sql = usePostgres()
    const newApiKey = crypto.randomUUID();

    await sql.unsafe(`
        UPDATE users
        SET api_key = '${newApiKey}'
        WHERE id = ${user.id}
    `)

    return {
        success: true,
        apiKey: newApiKey,
        message: "API key generated successfully.",
    }
})
