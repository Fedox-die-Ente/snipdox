import {getServerSession} from "#auth";
import {alreadyRegistered} from "~/server/actions/user.action";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)

    if (!session) {
        return
    }

    const email = session.user?.email
    if (!email) {
        return
    }

    const registered = await alreadyRegistered(email)
    if (!registered) {
        setCookie(event, "next-auth.session-token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        })

        return sendRedirect(event, '/logout')
    }
})