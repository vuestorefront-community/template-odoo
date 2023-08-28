import { sdk } from '@/sdk.config';
import { MutationWishlistAddItemArgs } from '@erpgap/odoo-sdk-api-client';

export const useWishlist: any = () => {
  const loading = ref(false);

  const loadWishlist = async () => {
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

  const WishlistAddItem = async () => {
    try {
      loading.value = true;
      const { data } = await sdk.odoo.wishlistAdd(
        { productId },
        { wishlistAdd: 'customQuery' }
      );
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
    loadWishlist,
    WishlistAddItem,
  };
};
