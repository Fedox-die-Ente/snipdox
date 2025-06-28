import {usePostgres} from "~/server/utils/postgres";

interface GitHubUser {
    email: string;
    image: string;
    name: string;
    username: string;
}

export async function createGitHubUser(user: GitHubUser) {
    const sql = usePostgres();

    const existing = await sql`
        SELECT id, email, image, username FROM users WHERE email = ${user.email}
    `;

    if (existing.length > 0) {
        return existing[0];
    }

    const inserted = await sql`
        INSERT INTO users (email, image, username)
        VALUES (${user.email}, ${user.image}, ${user.username})
        RETURNING id, email, image, username
    `;

    return inserted[0];
}


export async function alreadyRegistered(email: string) {
    const sql = usePostgres();

    const result_1 = await sql`
        SELECT id, email
        FROM users
        WHERE email = ${email}
    `;
    return result_1.length > 0 ? result_1[0] : null;
}

export async function userExists(email: string) {
    const sql = usePostgres();

    const result = await sql`
        SELECT id, email
        FROM users
        WHERE email = ${email}
    `;
    return result.length > 0;
}

export async function getUserByEmail(email: string) {
    const sql = usePostgres();

    const result = await sql`
        SELECT id, email, image, username
        FROM users
        WHERE email = ${email}
    `;
    return result.length > 0 ? result[0] : null;
}