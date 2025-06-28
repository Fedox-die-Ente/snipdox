import {getServerSession} from "#auth";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.user?.email) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "You must be logged in.",
        });
    }

    const sql = usePostgres();

    const rawQuery = getQuery(event);
    const page = Math.max(parseInt(rawQuery.page as string) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(rawQuery.pageSize as string) || 10, 1), 100);

    const user = await sql`
        SELECT id
        FROM users
        WHERE email = ${session.user.email}
    `;

    if (user.length === 0) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "User not found.",
        });
    }

    const userId = user[0].id;

    const pastes = await sql`
        SELECT id, paste_title, created_at, content, language, private, expiration
        FROM pastes
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
            LIMIT ${pageSize}
        OFFSET ${(page - 1) * pageSize}
    `;

    const countResult = await sql`
        SELECT COUNT(*)
        FROM pastes
        WHERE user_id = ${userId}
    `;

    const publicCount = await sql`
        SELECT COUNT(*)
        FROM pastes
        WHERE user_id = ${userId}
          AND private = false
    `;

    const privateCount = await sql`
        SELECT COUNT(*)
        FROM pastes
        WHERE user_id = ${userId}
          AND private = true
    `;

    const totalCount = parseInt(countResult[0].count, 10);

    return {
        pastes,
        totalCount,
        publicCount: parseInt(publicCount[0].count, 10),
        privateCount: parseInt(privateCount[0].count, 10),
        totalPages: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
    };
});
