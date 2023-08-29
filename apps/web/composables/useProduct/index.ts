import { sdk } from '@/sdk.config';
import {
  QueryProductArgs,
  QueryProductVariantArgs,
} from '@erpgap/odoo-sdk-api-client';

export const useProduct: any = () => {
  const loading = ref(false);
  const loadProductDetails = async (
    params: QueryProductArgs,
    customQuery = {}
  ) => {
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

  const loadProductVariant = async (
    params: QueryProductVariantArgs,
    customQuery = {}
  ) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductVariant(params, customQuery);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    loadProductDetails,
    loadProductVariant,
  };
};
