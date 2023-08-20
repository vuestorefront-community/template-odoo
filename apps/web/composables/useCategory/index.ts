import { sdk } from '@/sdk.config';
import {
  QueryProductsArgs,
  QueryCategoriesArgs,
  QueryCategoryArgs,
} from '@erpgap/odoo-sdk-api-client';

export const useCategory: any = () => {
  const loading = ref(false);

  const loadCategoryProducts = async (
    params: QueryProductsArgs | undefined
  ) => {
    try {
      loading.value = true;
      const { data: productData }: any = await sdk.odoo.getProductTemplateList(
        params
      );
      return {
        minPrice: productData?.products?.minPrice || 0,
        maxPrice: productData?.products?.maxPrice || 10000,
        products: productData.products.products,
        attributes: productData.products.attributeValues,
        itemsPerPage: 1,
        facets: {},
        perPageOptions: 20,
        totalProducts: productData.products.totalCount,
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const loadCategory = async (params: QueryCategoryArgs) => {
    try {
      loading.value = true;
      const categoryResponse: any = await sdk.odoo.getCategory(params);
      return {
        category: categoryResponse?.data?.category || {},
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const loadCategoryList = async (params: QueryCategoriesArgs | undefined) => {
    try {
      loading.value = true;
      const categoryListResponse: any = await sdk.odoo.getCategoryList(params);
      return {
        categories: categoryListResponse?.data?.categories?.categories || [],
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const getGrouped = (searchData: any) => {
    if (!searchData) return [];

    const data: any = [];

    searchData.forEach((item: any) => {
      const current = data.find(
        (itemData: { attributeName: any }) =>
          itemData.attributeName === item.attribute?.name
      );

      if (!current) {
        data.push({
          id: String(item.attribute.id),
          label: item.attribute?.name,
          attributeName: item.attribute?.name,
          type: item.displayType,
          count: 0,
          options: [],
        });
      }

      data
        .find(
          (itemData: { attributeName: any }) =>
            itemData.attributeName === item.attribute?.name
        )
        .options.push({
          id: String(item.search),
          value: item.id,
          label: item.name,
          metadata: item.search,
          htmlColor: item.htmlColor,
        });
    });

    return data;
  };

  return {
    loading,
    loadCategoryProducts,
    loadCategoryList,
    loadCategory,
    getGrouped,
  };
};
