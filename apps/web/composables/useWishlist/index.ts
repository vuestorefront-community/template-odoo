import { sdk } from '@/sdk.config';
import { MutationWishlistAddItemArgs } from '@erpgap/odoo-sdk-api-client';

export const useWishlist: any = () => {
  const loading = ref(false);

  const loadWishlist = async () => {
    try {
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistLoad();
      return data.wishlistItems;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const WishlistAddItem = async (productId: number) => {
    try {
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistAdd(
        { productId },
        { wishlistAdd: 'customQuery' }
      );
      return data.wishlistAddItem;
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
