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

    return paste[0];
});