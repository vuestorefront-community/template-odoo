const odooBaseUrl = process.env.BACKEND_BASE_URL || process.env.BASE_URL;
const redirectUrl = `${odooBaseUrl}vsf/redirects`;
const consola = require('consola');
const chalk = require('chalk');
const axios = require('axios');
const fsExtra = require('fs-extra');

module.exports = () => {
  consola.info(chalk.bold('ODOO'), ' - Started fetch ODOO redirects...');

  axios.get(redirectUrl)
  .then(({ data }) => {
    fsExtra.writeJson('customRoutes/redirects.json', data).then(() => {
      consola.success(chalk.bold('ODOO'), ' - Redirects.json written!');
    });
  }).catch((error) => {
    consola.error(chalk.bold('ODOO'), ' - Redirects request failed');
    consola.error(error);
  });
}