import { sdk } from '@/sdk.config';
import { QueryProductArgs } from '@erpgap/odoo-sdk-api-client';
import { CustomQuery } from '@vue-storefront/middleware';
import { ref } from 'vue';

export const useProduct: any = () => {
  const loading = ref(false);
  const responseData = useState('products');

  const loadProduct = async (
    params: QueryProductArgs,
    customQuery?: CustomQuery<'getProductTemplate'>
  ) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductTemplate(params, customQuery);
      if (data.product) {
        responseData.value = data.product;
        return data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    responseData,
    loadProduct,
  };
};
