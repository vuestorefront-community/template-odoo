const odooBaseUrl = process.env.BACKEND_BASE_URL || process.env.BASE_URL;
const graphqlBaseUrl = `${odooBaseUrl}graphql/vsf`;
const baseDomain = process.env.SITE_URL?.replace('https://', '')?.slice(0, -1) || '';
import Redis from 'redis-tag-cache';

const extendApiMethods = require('./custom-api/api');
const customQueries = require('./custom-api/customQueries');
process.redisTagClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: ''
});

module.exports = {
  integrations: {
    odoo: {
      location: '@vue-storefront/odoo-api/server',
      configuration: {
        odooBaseUrl,
        graphqlBaseUrl,
        baseDomain
      },
      extensions: (extensions) => [
        ...extensions,
        {
          name: 'odoo-extension',
          extendApiMethods
        }
      ],
      customQueries
    }
  }
};
