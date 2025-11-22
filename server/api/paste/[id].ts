export default defineEventHandler(async (event) => {

    const {id} = getRouterParams(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Paste ID is required.'
        });
    }

    const sql = usePostgres();

    const paste = await sql`
        SELECT *
        FROM pastes
        WHERE id = ${id}
    `;

    if (paste.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: 'Paste not found.'
        });
    }

    if (paste[0].private && paste[0].password_hash) {
        const providedPassword = getHeader(event, 'x-paste-password');
        
        if (!providedPassword) {
            return {
                requiresPassword: true,
                paste_title: paste[0].paste_title,
                language: paste[0].language,
                created_at: paste[0].created_at,
                username: null,
                private: true
            };
        }

        const {verifyPassword} = await import('~/server/utils/crypto');
        if (!verifyPassword(providedPassword, paste[0].password_hash)) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'Invalid password.'
            });
        }
    }

    const userId = paste[0]?.user_id;

    if (userId) {
        const user = await sql`
            SELECT username
            FROM users
            WHERE id = ${userId}
        `;
        paste[0].username = user[0]?.username || 'Unknown User';
    } else {
        paste[0].username = 'Unknown User';
    }

    delete paste[0].password_hash;

    return paste[0];
});