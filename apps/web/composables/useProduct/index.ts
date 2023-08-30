import { sdk } from '@/sdk.config';
import {
  QueryProductArgs,
  QueryProductVariantArgs,
} from '@erpgap/odoo-sdk-api-client';

export const useProduct: any = () => {
  const loading = ref(false);
  const loadProductDetails = async (params: QueryProductArgs) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductTemplate(params, {
        getProductTemplate: 'customQueryName',
      });
      return {
        product: data.product,
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const loadProductVariant = async (params: QueryProductVariantArgs) => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.getProductVariant(params, {
        getProductVariant: 'customQueryName',
      });
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
