import {getServerSession} from "#auth";
import {getUserByEmail} from "~/server/actions/user.action";
import type {CreatePastePayload} from "~/types/types";
import {generatePasteId} from "~/server/utils/crypto";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'You must be logged in to create a paste.'
        });
    }

    const body = await readBody(event) as CreatePastePayload;

    if (!body.title || !body.codeContent || !body.language) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Title, content, and language are required.'
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

    const expiration = body.expirationType || 'never'; // Default to 'never' if not provided
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
            default:
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    message: 'Invalid expiration value.'
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

    const user = await getUserByEmail(userEmail);

    if (user != null) {
        const sql = usePostgres();

        const pasteId = generatePasteId(userEmail);

        const [paste] = await sql`
            INSERT INTO pastes (id, user_id, paste_title, language, expiration,
                                content, error_title, error_content, private)
            VALUES (${pasteId},
                    ${user.id},
                    ${body.title},
                    ${body.language},
                    ${expirationTimestamp},
                    ${body.codeContent},
                    ${body.errorTitle || null},
                    ${body.errorDetails || null},
                    ${body.isPrivate || false}) RETURNING id;
        `;

        return {
            success: true,
            statusCode: 201,
            message: 'Paste created successfully.',
            pasteId: paste.id
        };
    } else {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'User does not exist.'
        });
    }

});