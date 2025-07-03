import {getServerSession} from "#auth"
import {getUserByEmail} from "~/server/actions/user.action"
import {createError, defineEventHandler} from "h3" // Added missing imports

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)

    if (!session?.user?.email) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to view your API key.",
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

    return {
        success: true,
        apiKey: user.api_key || null,
    }
})
