// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Vue Storefront',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/fontaine'],

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
