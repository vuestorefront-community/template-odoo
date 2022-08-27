const buildRedirects = require('./buildRedirects');
const buildRoutes = require('./buildRoutes');

switch (process.argv[2]) {
  case 'routes': buildRoutes(); break;
  case 'redirects': buildRedirects(); break;
  default:break;
}
