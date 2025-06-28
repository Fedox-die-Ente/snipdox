// https://nuxt.com/docs/api/configuration/nuxt-config]''
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    $development: undefined, $env: undefined, $meta: undefined, $production: undefined, $test: undefined,
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    modules: [
        '@nuxt/eslint',
        '@sidebase/nuxt-auth',
        'nuxt-svgo',
        'nuxt-cron'
    ],
    css: ['~/assets/css/main.css'],
    nitro: {
        preset: 'vercel'
    },
    typescript: {
        shim: false
    },
    auth: {
        isEnabled: true,
        baseURL: process.env.AUTH_ORIGIN,
        provider: {
            type: 'authjs'
        },
        globalAppMiddleware: {
            isEnabled: true
        }
    },
    vite: {plugins: [tailwindcss(),],},
    app: {
        head: {
            htmlAttrs: {
                lang: 'en'
            },
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico'
                }
            ]
        }
    },
    cron: {
        runOnInit: true,
        timeZone: 'Europe/Berlin',
        jobsDir: 'cron'
    }
})