const { integrations } = require('../middleware.config');
const redirectUrl = `${integrations.odoo.configuration.odooBaseUrl}vsf/redirects`;
const consola = require('consola');
const chalk = require('chalk');
const axios = require('axios');
const fsExtra = require('fs-extra');

export default async () => {
  consola.info(chalk.bold('ODOO'), ' - Started fetch ODOO redirects...');

  const { data } = await axios.get(redirectUrl);
  await fsExtra.writeJson('customRoutes/redirects.json', data);

  consola.success(chalk.bold('ODOO'), ' - Redirects.json written!');
};
