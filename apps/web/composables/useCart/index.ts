import { sdk } from '@/sdk.config';

export const useCart: any = () => {
  const loading = ref(false);

  const loadCart = async () => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.cartLoad();
      return {
        data
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const cartAdd = async (productId: number, quantity: number) => {
    try {

      const { data } = await sdk.odoo.cartAdd(
        { productId, quantity },
        { cartAdd: '123' }
      );

      return {data};
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    loadCart,
    cartAdd
  };
};
