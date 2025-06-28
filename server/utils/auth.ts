import {getServerSession} from '#auth'

export async function requireAdmin(event: any) {
    const session = await getServerSession(event)

    if (!session?.user?.email) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'You must be logged in.',
        })
    }

    const sql = usePostgres()

    const [user] = await sql`
        SELECT id, admin
        FROM users
        WHERE email = ${session.user.email}
    `

    if (!user || !user.admin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'You must be an admin to access this resource.',
        })
    }

    return user
}