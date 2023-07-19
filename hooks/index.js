import addTrailingSlashToUrls from '../addTrailingSlash';
import buildRoutes from "./buildRoutes";
import buildRedirects from "./buildRedirects";
import { checkWinstonHook } from "@vue-storefront/odoo";

export default {
  
  build: {
    async before(builder) {
      //await addTrailingSlashToUrls(process.argv);
      if (!process.argv.includes("--dontGenerateCustomRoutes")) {
        await buildRoutes();
        await buildRedirects(builder);
        await checkWinstonHook();
      }
    },
  },
};