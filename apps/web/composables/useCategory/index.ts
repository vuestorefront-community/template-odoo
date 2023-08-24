import { sdk } from '@/sdk.config';
import {
  QueryProductsArgs,
  QueryCategoriesArgs,
  QueryCategoryArgs,
} from '@erpgap/odoo-sdk-api-client';

export const useCategory: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    loadProducts: null,
    loadCategory: null,
    loadCategoryList: null,
  });
  const loadProducts = async (params: QueryProductsArgs | undefined) => {
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
      error.loadProducts = err;
    } finally {
      loading.value = false;
    }
  };

  const loadCategory = async (params: QueryCategoryArgs) => {
    try {
      const categoryResponse: any = await sdk.odoo.getCategory(params);
      return {
        category: categoryResponse?.data?.category || {},
      };
    } catch (err) {
      error.loadCategory = err;
    }
  };

  const loadCategoryList = async (params: QueryCategoriesArgs | undefined) => {
    try {
      const categoryListResponse: any = await sdk.odoo.getCategoryList(params);
      return {
        categories: categoryListResponse?.data?.categories?.categories || [],
      };
    } catch (err) {
      error.loadCategoryList = err;
    }
  };

  const buildTree = (categories: any) => {
    if (!categories) {
      return [];
    }
    return categories.map(
      (category: { name: string; slug: string; childs: any; id: string }) => ({
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      })
    );
  };

  const getCategoryTree = (searchData: { data: { category: any } }) => {
    if (!searchData) {
      return { items: [], label: '', isCurrent: false };
    }

    const category: any = searchData;
    if (category) {
      return {
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      };
    }
    return {};
  };

  return {
    loading,
    loadProducts,
    loadCategoryList,
    loadCategory,
    getCategoryTree,
    error: computed(() => error),
  };
};
