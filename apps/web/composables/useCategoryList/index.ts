import { sdk } from '@/sdk.config';
import { QueryCategoriesArgs } from '@erpgap/odoo-sdk-api-client';

export const useCategoryList: any = () => {
  const loading = ref(false);
  const responseData = ref();

  const loadCategoryList = async (
    params: QueryCategoriesArgs | undefined,
    customQuery = {}
  ) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getCategoryList(params, customQuery);
      if (data.categories) {
        const categories = data?.categories?.categories || [];
        responseData.value = categories.filter(
          (category: any) =>
            category.name === 'WOMEN' || category.name === 'MEN'
        );
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
    loadCategoryList,
  };
};
