const odooBaseUrl = 'https://vsfdemo15.labs.odoogap.com/';
const graphqlBaseUrl = `${odooBaseUrl}graphql/vsf`;
const baseDomain = process.env.BASE_DOMAIN || 'vsfdemo15.labs.odoogap.com'

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
      },
      extensions: (extensions) => [
        ...extensions,
        {
          name: 'odoo-extension',
          extendApiMethods,
        },
      ],
      customQueries,
    }
  }
};
