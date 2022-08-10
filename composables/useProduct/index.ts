import { computed } from '@nuxtjs/composition-api';
import { sharedRef, useVSFContext, Logger } from '@vue-storefront/core';

const useProduct = () : any => {
  // Loads context used to call API endpoint
  const context = useVSFContext();

  // Shared ref holding the response from the API
  const topSellers = sharedRef(null, 'useProduct-undefined');

  // Shared ref indicating whether any method is waiting for the data from the API
  const loading = sharedRef(false, 'useProduct-loading-undefined');

  // Shared ref holding errors from the methods
  const error = sharedRef(
    {
      loadTopSeller: null
    },
    'useProduct-error-undefined'
  );

  // Method to call an API endpoint and update `result`, `loading` and `error` properties
  const loadTopSeller = async (params) => {
    Logger.debug('useProduct/undefined/loadTopSeller', params);

    try {
      loading.value = true;
      // Change "odoo" to the name of the integration
      const { data } = await context.$odoo.api.loadTopSellers(params);

      topSellers.value = data.topSellers;

      error.value.loadTopSeller = null;
    } catch (err) {
      error.value.loadTopSeller = err;
      Logger.error('useProduct/undefined/loadTopSeller', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loadTopSeller,
    topSellers: computed(() => topSellers.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value)
  };
};

export default useProduct;
