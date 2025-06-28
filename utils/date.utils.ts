export function formatRelativeExpiration(expiration: string | null): string {
    if (!expiration) return 'Never';

    const expiresDate = new Date(expiration);
    const now = new Date();

    const diff = expiresDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `in ${seconds} second${seconds !== 1 ? 's' : ''}`;
}

export function formatDateTime(date: string): string {
    const d = new Date(date);
    return d.toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short'
    });
}