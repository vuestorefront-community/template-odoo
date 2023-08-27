import { sdk } from '@/sdk.config';

export const useWishlist: any = () => {
  const loading = ref(false);

  const loadCart = async () => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.wishlistLoad();
      return {
        data,
      };
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    loadCart,
  };
};
