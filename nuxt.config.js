/* eslint-disable camelcase */
import webpack from 'webpack';
import { getRoutes } from './routes';
import { checkWinstonHook } from '@vue-storefront/odoo';
import getAppRoutes from './sitemap';
import redirects from './customRoutes/redirects.json';
import theme from './themeConfig';
import { format, transports } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;

const isDev = process.env.NODE_ENV !== 'production';

export default {
  hooks: {
    build: {
      before() {
        checkWinstonHook();
      }
    }
  },
  components: [
    '~/components/Core/Atoms'
  ],
  css: ['@/assets/styles.scss'],
  winstonLog: {
    useDefaultLogger: false,
    skipRequestMiddlewareHandler: true,
    skipErrorMiddlewareHandler: true,
    loggerOptions: {
      format: combine(
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.Console()
      ]
    }
  },
  head: {
    title: 'Vue Storefront',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  router: {
    extendRoutes(routes) {
      getRoutes(`${__dirname}`)
        .forEach((route) => routes.unshift(route));
    },
    middleware: ['checkout']
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [300, 400, 500, 600, 700]
      }
    },
    download: false,
    prefetch: true,
    preconnect: true,
    preload: true,
    display: 'swap'
  },
  pwa: {
    meta: {
      name: 'VSF Odoo',
      theme_color: '#fff',
      lang: 'en',
      description: 'VSF Odoo',
      twitterCard: 'summary_large_image'
    },
    manifest: {
      name: 'VSF Odoo',
      description: 'VSF Odoo',
      short_name: 'VSFOdoo',
      lang: 'en'
    },
    icon: {
      purpose: 'maskable'
    },
    workbox: {
      cleanupOutdatedCaches: true,
      preCaching: [
        '/error/error.svg',
        '/favicon.ico'
      ]
    }
  },
  device: {
    refreshOnResize: true
  },
  serverMiddleware: [
    '~/serverMiddleware/body-parser.js'
  ],
  loading: { color: '#fff' },
  plugins: [
    '~/plugins/getImage.ts',
    '~/plugins/vee-validate.ts'
  ],
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    // '@unlighthouse/nuxt',
    '@nuxtjs/pwa',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxtjs/web-vitals',
    '@nuxtjs/tailwindcss',

    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-fonts',
    [
      '@vue-storefront/nuxt',
      {
        performance: {
          httpPush: true
        },
        // @core-development-only-start
        // @core-development-only-end
        useRawSource: {
          dev: ['@vue-storefront/odoo', '@vue-storefront/core'],
          prod: ['@vue-storefront/odoo', '@vue-storefront/core']
        }
      }
    ],
    // @core-development-only-start
    [
      '@vue-storefront/nuxt-theme',
      {
        routes: false
      }
    ],
    // @core-development-only-end
    /* project-only-start
    ['@vue-storefront/nuxt-theme'],
    project-only-end */
    ['@vue-storefront/odoo/nuxt', {}]
  ],
  publicRuntimeConfig: {
    theme,
    baseURL: process.env.PUBLIC_PATH || process.env.BASE_URL,
    middlewareUrl: isDev ? 'http://localhost:3000/api/' : `${process.env.SITE_URL}api`,
    siteURL: process.env.SITE_URL
  },
  modules: [
    'nuxt-speedkit',
    '@nuxtjs/pwa',
    'nuxt-precompress',
    '@nuxt/image',
    '@vue-storefront/middleware/nuxt',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    ['@vue-storefront/http-cache/nuxt', {
      default: 'max-age=360'
    }],
    ['@vue-storefront/cache/nuxt', {
      enabled: process.env.REDIS_ENABLED === 'true',
      invalidation: {
        endpoint: '/cache-invalidate',
        key: process.env.INVALIDATION_KEY,
        handlers: [
          '@vue-storefront/cache/defaultHandler'
        ]
      },
      driver: [
        '@vue-storefront/redis-cache',
        {
          defaultTimeout: 86400,
          redis: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || ''
          }
        }
      ]
    }],
    'nuxt-i18n',
    '@nuxtjs/gtm',
    '@nuxtjs/sitemap',
    '@nuxtjs/redirect-module',
    'nuxt-winston-log'
  ],
  speedkit: {
    detection: {
      performance: true,
      browserSupport: true
    }
  },
  // google tag manager
  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID,
    enabled: !isDev,
    pageTracking: !isDev,
    pageViewEventName: 'PageView',
    debug: process.env.NODE_ENV !== 'production'
  },

  // redirect
  redirect: {
    statusCode: 301,
    rules: redirects
  },

  nuxtPrecompress: {
    enabled: !isDev,
    report: false,
    test: /\.(js|css|html|txt|xml|svg)$/,
    // Serving options
    middleware: {
      // You can disable middleware if you serve static files using nginx...
      enabled: true,
      // Enable if you have .gz or .br files in /static/ folder
      enabledStatic: true,
      // Priority of content-encodings, first matched with request Accept-Encoding will me served
      encodingsPriority: ['br', 'gzip']
    },

    // build time compression settings
    gzip: {
      enabled: !isDev,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: '[path].gz[query]',
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 }
    },
    brotli: {
      enabled: !isDev,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: '[path].br[query]',
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8
    }
  },
  i18n: {
    baseUrl: process.env.SITE_URL,
    strategy: 'prefix_and_default',
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States' },
      { name: 'DE', label: 'Germany' },
      { name: 'RU', label: 'Russian' }
    ],
    currencies: [
      { name: 'EUR', label: 'Euro' },
      { name: 'USD', label: 'Dollar' },
      { name: 'RUB', label: 'Rubble' }
    ],
    locales: [
      {
        code: 'en',
        label: 'English',
        file: 'en.json',
        iso: 'en'
      },
      // {
      //   code: 'de',
      //   label: 'German',
      //   file: 'de.json',
      //   iso: 'de'
      // },
      // {
      //   code: 'ru',
      //   label: 'Russian',
      //   file: 'ru.json',
      //   iso: 'ru'
      // }
    ],
    defaultLocale: 'en',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    detectBrowserLanguage: false,
    vueI18n: {
      fallbackLocale: 'en',
      numberFormats: {
        en: {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
          }
        },
        de: {
          currency: {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol'
          }
        },
        ru: {
          currency: {
            style: 'currency',
            currency: 'RUB',
            currencyDisplay: 'symbol'
          }
        }
      }
    },
    detectBrowserLanguage: {
      cookieKey: 'vsf-locale'
    }
  },

  // sitemap options
  sitemap: {
    hostname: process.env.SITE_URL,
    exclude: ['/checkout/**', '/checkout', '/cart', '/my-account', '/order-history'],
    i18n: false,
    cacheTime: 6000,
    gzip: true,
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    routes: getAppRoutes,
    filter: ({ routes }) => {
      return routes.filter(route => {
        return route.path?.toLowerCase() === route.path;
      });
    }
  },

  styleResources: {
    scss: [
      require.resolve('@storefront-ui/shared/styles/_helpers.scss', {
        paths: [process.cwd()]
      })
    ]
  },
  build: {
    extractCSS: !isDev,
    optimizeCSS: !isDev,
    parallel: !isDev,
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    transpile: ['vee-validate/dist/rules', /^@storefront-ui/],
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  }
};
