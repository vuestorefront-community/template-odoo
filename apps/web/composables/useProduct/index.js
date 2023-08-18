import { sdk } from '@/sdk.config';
import { ref } from 'vue';

export const useProduct = () => {
  const loading = ref(false);
  const responseData = useState('products');

  const loadProduct = async (params, customQuery = {}) => {
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
