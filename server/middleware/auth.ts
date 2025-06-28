import {getServerSession} from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) return

    const email = session.user?.email
    if (!email) return

    const sql = usePostgres()

    const [allowedUser] = await sql`
        SELECT email
        FROM allowed_emails
        WHERE email = ${email} LIMIT 1
    `

    if (!allowedUser) {
        return clearSessionAndRedirect(event, '/logout')
    }

    const [user] = await sql`
        SELECT id, admin
        FROM users
        WHERE email = ${email} LIMIT 1
    `

    if (!user) {
        return clearSessionAndRedirect(event, '/logout')
    }

    if (event.path.startsWith('/admin') && !user.admin) {
        return sendRedirect(event, '/')
    }
})

function clearSessionAndRedirect(event: any, to: string) {
    setCookie(event, 'next-auth.session-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
    })
    return sendRedirect(event, to)
}
