import { sdk } from '@/sdk.config';
import { QueryProductsArgs } from '@erpgap/odoo-sdk-api-client';

export const useCategory: any = () => {
  const loading = ref(false);
  const responseData = ref();

  const loadCategoryProducts = async (
    params: QueryProductsArgs | undefined,
    customQuery = {}
  ) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductTemplateList(
        params,
        customQuery
      );
      if (data.products) {
        responseData.value = data?.products?.products || [];
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
    loadCategoryProducts,
  };
};
