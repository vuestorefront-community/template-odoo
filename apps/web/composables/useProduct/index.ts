import { sdk } from '@/sdk.config';
import { QueryProductArgs } from '@erpgap/odoo-sdk-api-client';

export const useProduct: any = () => {
  const loading = ref(false);
  const loadProduct = async (params: QueryProductArgs, customQuery = {}) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductTemplate(params, customQuery);
      return {
        product: data.product,
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    loadProduct,
  };
};
