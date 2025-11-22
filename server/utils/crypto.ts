import crypto from 'node:crypto';

export function generatePasteId(email: string): string {
    const now = Date.now().toString();
    const base = `${email}-${now}`;
    const hash = crypto.createHash('sha256').update(base).digest('hex');
    return hash.slice(0, 8);
}

export function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}