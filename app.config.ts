export interface SnipdoxConfig {
    name?: string;
}

declare module '@nuxt/schema' {
    interface AppConfigInput {
        app?: SnipdoxConfig;
    }
}

export default defineAppConfig({
    app: {
        name: 'Snipdox'
    } as SnipdoxConfig
});