const https = require('https');

const odooBaseUrl = process.env.BACKEND_BASE_URL || process.env.BASE_URL;
const graphqlBaseUrl = `${odooBaseUrl}graphql/vsf`;
const baseDomain = process.env.SITE_URL?.replace('https://', '')?.slice(0, -1) || '';

const extendApiMethods = require('./custom-api/api');
const customQueries = require('./custom-api/customQueries');

module.exports = {
  integrations: {
    odoo: {
      location: '@vue-storefront/odoo-api/server',
      configuration: {
        odooBaseUrl,
        graphqlBaseUrl,
        baseDomain,
        redisClient: (process.env.REDIS_ENABLED === 'true'),
        fetchOptions: {
          agent: new https.Agent({
            rejectUnauthorized: false
          })
        }
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
