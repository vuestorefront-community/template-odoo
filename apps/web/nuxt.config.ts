// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Vue Storefront',
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],

  vite: {
    server: {
      fs: {
        strict: false,
        // used to allow importing from outside of the root directory
      },
    },
  },

  devtools: {
    enabled: true,
  },
});
