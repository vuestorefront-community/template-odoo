import { sdk } from '@/sdk.config';

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
      currentWishlist.value = data.wishlistAddItem;
      return data.wishlistAddItem;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const WishlistRemoveItem = async (id: number) => {
    try {
      const removeItemParams: any = {
        wishId: id,
      };
      const { data }: any = await sdk.odoo.wishlistRemove(removeItemParams, {
        wishlistRemove: 'customQuery',
      });
      return data.wishlistRemoveItem;
    } catch (err) {
      console.log(err);
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
