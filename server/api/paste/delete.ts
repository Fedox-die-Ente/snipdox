import {getServerSession} from "#auth";

export default defineEventHandler(async (event) => {

    const body = await readBody(event) as { pasteId: string };

    if (!body.pasteId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Paste ID is required.'
        });
    }

    const session = await getServerSession(event);
    if (!session) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'You must be logged in to delete a paste.'
        });
    }

    const userEmail = session.user?.email;
    if (!userEmail) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'User email is required.'
        });
    }

    const sql = usePostgres();

    const paste = await sql`
        SELECT *
        FROM pastes
        WHERE id = ${body.pasteId}
    `;

    if (paste.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: 'Paste not found.'
        });
    }

    const pasteOwnerId = paste[0].user_id;

    const user = await sql`
        SELECT id
        FROM users
        WHERE email = ${userEmail}
    `;

    if (user.length === 0) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'User not found.'
        });
    }

    const userId = user[0].id;

    if (pasteOwnerId !== userId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'You do not have permission to delete this paste.'
        });
    }

    await sql`
        DELETE
        FROM pastes
        WHERE id = ${body.pasteId}
    `;

    return {
        success: true,
        message: 'Paste deleted successfully.'
    };
})