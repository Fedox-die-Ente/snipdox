export interface SnipdoxConfig {
    name?: string;
    allowedUsers?: string[];
}

declare module '@nuxt/schema' {
    interface AppConfigInput {
        app?: SnipdoxConfig;
    }
}

export default defineAppConfig({
    app: {
        name: 'Snipdox',
        allowedUsers: ['mrminecrafttv19@gmail.com']
    } as SnipdoxConfig
});