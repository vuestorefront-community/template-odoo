/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */

const cacheOptions = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
};

const timeoutPlugin = new workbox.expiration.ExpirationPlugin({
  // Timeout 1 day // Only cache 150 resources.
  maxEntries: 150,
  purgeOnQuotaError: true,
  maxAgeSeconds: 24 * 60 * 60
});

const cachePlugin = {
  cacheKeyWillBeUsed: async ({ request }) => {

    const cacheKey = new Request(request.referrer, {
      headers: request.headers,
      method: 'GET'
    });

    return cacheKey;
  }
};

const apiHandler = new workbox.strategies.StaleWhileRevalidate({
  cacheName: 'odoo-apis',
  cacheOptions,
  plugins: [cachePlugin, timeoutPlugin]
});

const imageHandler = new workbox.strategies.StaleWhileRevalidate({
  cacheName: 'odoo-images',
  cacheOptions: { ignoreVary: true },
  plugins: [timeoutPlugin]
});

workbox.routing.registerRoute(({ event }) => event.request.headers.get('Accept').includes('image'), imageHandler);
