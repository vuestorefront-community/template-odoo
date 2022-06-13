import buildRedirects from './buildRedirects';
export default {
  build: {
    async before(builder) {
      await buildRedirects(builder);
    }
  }
};
