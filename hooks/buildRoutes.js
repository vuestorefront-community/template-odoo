const odooBaseUrl = process.env.BACKEND_BASE_URL || process.env.BASE_URL;
const graphqlBaseUrl = `${odooBaseUrl}graphql/vsf`;
const consola = require('consola');
const chalk = require('chalk');
const axios = require('axios');
const fsExtra = require('fs-extra');
const queries = require('../helpers/buildQueries');

const headers = { headers: {
  'Content-Type': 'application/json',
  'resquest-host': odooBaseUrl
}};

const fetchProducts = async () => {
  return await axios.post(graphqlBaseUrl, { query: `${queries.products}` }, headers);
};

const fetchCategories = async () => {
  return await axios.post(graphqlBaseUrl, { query: `${queries.categories}` }, headers);
};

const removeLastItemFromArray = (array) => {
  const slugs = array?.map(item =>item.slug.split('/'));
  const splited = slugs.map(item => ({
    name: item[item.length - 1],
    path: item.join('/')
  }));
  return [...new Set(splited)];
};

export default async () => {
  consola.info(chalk.bold('ODOO'), ' - Started fetch (product|categories) to build custom routes...');

  const { data } = await fetchProducts();
  const { data: categoriesData } = await fetchCategories();

  await fsExtra.outputJson('customRoutes/products.json', removeLastItemFromArray(data.data.products.products));
  await fsExtra.outputJson('customRoutes/categories.json', categoriesData.data.categories.categories
    .filter(item => item.slug && item.slug !== 'false')
    .map(item => ({
      name: `${item.name}-${item.id}`,
      path: item.slug
    })));

  consola.success(chalk.bold('ODOO'), ' - Finish build custom routes!');
};
