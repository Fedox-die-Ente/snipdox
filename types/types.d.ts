export interface CreatePastePayload {
    title: string;
    language: string;
    expirationType: 'never' | '1h' | '1d' | '1w';
    codeContent: string;
    errorTitle: string;
    errorDetails: string;
    isPrivate: boolean;
    password?: string;
}

export interface Paste {
    id: string;
    user_id: string;
    username: string;
    paste_title: string;
    language: string;
    expiration: String | '';
    content: string;
    created_at: String | '';
    error_title: string | 'Error Log';
    error_content: string | 'No error details provided';
    private: boolean;
    requiresPassword?: boolean;
}

import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            isRegistered?: boolean
        } & DefaultSession['user']
    }
} 