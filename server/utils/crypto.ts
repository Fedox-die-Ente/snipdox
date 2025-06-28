import crypto from 'node:crypto';

export function generatePasteId(email: string): string {
    const now = Date.now().toString();
    const base = `${email}-${now}`;
    const hash = crypto.createHash('sha256').update(base).digest('hex');
    return hash.slice(0, 8);
}