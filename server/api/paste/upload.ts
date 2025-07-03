import {createError, defineEventHandler, getHeader} from 'h3';
import {generatePasteId} from "~/server/utils/crypto";

export default defineEventHandler(async (event) => {
    const apiKey = getHeader(event, 'x-api-key') || '';
    if (!apiKey) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "API key is required.",
        });
    }

    const sql = usePostgres();

    const user = await sql`
        SELECT id, email, image, username
        FROM users
        WHERE api_key = ${apiKey}
    `;

    if (user.length === 0) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "Invalid API key.",
        });
    }

    const body = await readBody(event);

    if (!body.paste_title || !body.content || !body.language) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Title, content, and language are required.",
        });
    }

    const expiration = body.expiration || 'never';
    let expirationTimestamp: Date | null = null;

    if (expiration !== 'never') {
        const now = new Date();
        let future = 0;

        switch (expiration) {
            case '1h':
                future = 60 * 60 * 1000;
                break;
            case '1d':
                future = 24 * 60 * 60 * 1000;
                break;
            case '1w':
                future = 7 * 24 * 60 * 60 * 1000;
                break;
            case '1m':
                future = 30 * 24 * 60 * 60 * 1000; // 1 Monat
                break;
            default:
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    message: 'Invalid expiration value. Allowed: 1h, 1d, 1w, 1m, never'
                });
        }

        const expiresAt = new Date(now.getTime() + future);
        expirationTimestamp = new Date(Date.UTC(
            expiresAt.getUTCFullYear(),
            expiresAt.getUTCMonth(),
            expiresAt.getUTCDate(),
            expiresAt.getUTCHours(),
            expiresAt.getUTCMinutes(),
            expiresAt.getUTCSeconds()
        ));
    }

    if (expiration === 'never') {
        expirationTimestamp = null;
    }

    try {
        const pasteId = generatePasteId(user[0].email);

        const [paste] = await sql`
            INSERT INTO pastes (id, user_id, paste_title, language, expiration,
                                content, error_title, error_content, private)
            VALUES (${pasteId},
                    ${user[0].id},
                    ${body.paste_title},
                    ${body.language},
                    ${expirationTimestamp},
                    ${body.content},
                    ${body.error_title || null},
                    ${body.error_content || null},
                    ${body.private || false}) RETURNING id, paste_title, language, created_at;
        `;

        const pasteUrl = `https://snipdox.fedox.ovh/paste/${paste.id}`;

        return {
            success: true,
            statusCode: 201,
            message: 'Paste created successfully via API.',
            data: {
                id: paste.id,
                title: paste.paste_title,
                language: paste.language,
                url: pasteUrl,
                created_at: paste.created_at,
                expiration: expiration,
                expires_at: expirationTimestamp
            }
        };

    } catch (error) {
        console.error('Database error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to create paste. Please try again.'
        });
    }
});