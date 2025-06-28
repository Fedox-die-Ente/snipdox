import {usePostgres} from "~/server/utils/postgres";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.pasteId || !body.reportReason) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Paste ID and report reason are required.'
        });
    }

    const headers = getRequestHeaders(event)
    const forwardedFor = headers['x-forwarded-for']
    const ip = forwardedFor ? forwardedFor.split(',')[0] : event.node.req.socket.remoteAddress;
    if (!ip) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'An unknown error occurred while retrieving your IP address.'
        });
    }

    const sql = usePostgres();

    const alreadyReported = await sql`
        SELECT id
        FROM reports
        WHERE paste_id = ${body.pasteId}
          AND ip_address = ${ip}
    `;

    if (alreadyReported.length > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'You have already reported this paste.'
        });
    }

    const inserted = await sql`
        INSERT INTO reports (paste_id, ip_address, reason)
        VALUES (${body.pasteId}, ${ip}, ${body.reportReason}) RETURNING id
    `;

    if (inserted.length === 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to create report.'
        });
    }

    return {
        success: true,
        statusCode: 201,
        message: 'Report created successfully.',
        reportId: inserted[0].id
    };
});