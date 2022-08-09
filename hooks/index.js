import buildRoutes from './buildRoutes';
import buildRedirects from './buildRedirects';
export default {
  build: {
    async before(builder) {
      await buildRoutes();
      await buildRedirects(builder);
    }
  }
};
