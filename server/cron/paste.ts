import {defineCronHandler} from '#nuxt/cron'

export default defineCronHandler('everyMinute', async () => {
    const sql = usePostgres();

    try {
        await sql`
            DELETE
            FROM pastes
            WHERE expiration IS NOT NULL
              AND expiration <= NOW();
        `;
    } catch (error) {
        console.error('Error deleting expired pastes:', error);
    }
})