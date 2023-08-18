import { sdk } from '@/sdk.config';
import { QueryProductArgs } from '@erpgap/odoo-sdk-api-client';

export const useProduct: any = () => {
  const loading = ref(false);
  const responseData = useState('product');

  const loadProduct = async (
    params: QueryProductArgs,
    customQuery = {}
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
