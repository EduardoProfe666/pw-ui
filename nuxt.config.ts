// https://nuxt.com/docs/api/configuration/nuxt-config
import piniaPersistedState from 'pinia-plugin-persistedstate';
export default defineNuxtConfig({
    ssr: false,

    modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],

    css: ["vuetify/styles", "@mdi/font/css/materialdesignicons.css"],

    build: {
        transpile: ["vuetify"],
    },

    app: {
        head: {
            title: "PW-UI",
            meta: [
                {charset: "utf-8"},
                {name: "viewport", content: "width=device-width, initial-scale=1"},
                {property: "og:title", content: "PW-UI"},
                {
                    property: "og:description",
                    content:
                        "Front de gestión para el Sistema de Programación Web del G-31.",
                },
                {property: "og:type", content: "website"},
                {property: "og:url", content: "https://pw-ui.onrender.com"},
                {
                    property: "og:image",
                    content: "https://pw-ui.onrender.com/og-image.png",
                },
                {name: "twitter:card", content: "summary_large_image"},
                {name: "twitter:title", content: "PW-UI"},
                {
                    name: "twitter:description",
                    content:
                        "Front de gestión para el Sistema de Programación Web del G-31.",
                },
                {
                    name: "twitter:image",
                    content: "https://pw-ui.onrender.com/og-image.png",
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.API_URL || "http://localhost:3000",
        },
    },

    compatibilityDate: "2024-11-21",
});
