import {getServerSession} from '#auth'
import {requireAdmin} from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    const session = await getServerSession(event)
    if (!session?.user?.email) {
        throw createError({statusCode: 403, message: 'Unauthorized'})
    }

    const sql = usePostgres()

    const [user] = await sql`SELECT admin
                             FROM users
                             WHERE email = ${session.user.email}`
    if (!user?.admin) {
        throw createError({statusCode: 403, message: 'Admins only'})
    }

    const [[{count: users}], [{count: pastes}], [{count: reports}], [{count: allowed}]] = await Promise.all([
        sql`SELECT COUNT(*)
            FROM users`,
        sql`SELECT COUNT(*)
            FROM pastes`,
        sql`SELECT COUNT(*)
            FROM reports`,
        sql`SELECT COUNT(*)
            FROM allowed_emails`
    ])

    return {
        users: Number(users),
        pastes: Number(pastes),
        reports: Number(reports),
        allowed: Number(allowed)
    }
})
