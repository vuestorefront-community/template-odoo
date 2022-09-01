require('dotenv').config();
const consola = require('consola');
const chalk = require('chalk');
const axios = require('axios');
const fsExtra = require('fs-extra');
const odooBaseUrl = process.env.BACKEND_BASE_URL || process.env.BASE_URL;

const redirectUrl = `${odooBaseUrl}vsf/redirects`;

module.exports = () => {
  if (!odooBaseUrl) {
    consola.error(chalk.bold('ODOO'), ' - You need create a .env or set BACKEND_BASE_URL || BASE_URL ');
    return;
  }

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
};
