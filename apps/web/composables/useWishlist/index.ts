import { sdk } from '@/sdk.config';
import { MutationWishlistAddItemArgs } from '@erpgap/odoo-sdk-api-client';

export const useWishlist: any = () => {
  const loading = ref(false);

  const currentWishlist = ref<any>({});

  const loadWishlist = async () => {
    try {
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistLoad();
      currentWishlist.value = data.wishlistItems;
      return data.wishlistItems;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const WishlistAddItem = async (id: number) => {
    try {
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistAdd(
        { productId: id },
        { wishlistAdd: 'customQuery' }
      );
      currentWishlist.value = data.wishlistItems;
      return data.wishlistAddItem;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const WishlistRemoveItem = async (id: number) => {
    try {
      const params: MutationWishlistAddItemArgs = { productId: Number(id) };
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistRemove(params, {
        wishlistRemove: 'customQuery',
      });
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
    wishlistItems: computed(() => currentWishlist.value?.wishlistItems),
    WishlistAddItem,
    WishlistRemoveItem,
  };
};
