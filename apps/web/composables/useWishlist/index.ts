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
    // const wishlistItem = currentWishlist.value?.wishlistItems.find(
    //   (item: { product: { id: number } }) => item.product.id === id
    // );
    try {
      const removeItemParams: any = {
        wishId: 182,
      };
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistRemove(removeItemParams, {
        wishlistRemove: 'customQuery',
      });
      currentWishlist.value = data.wishlistRemoveItem;
      return data.wishlistRemoveItem;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  // const isInWishlist = async (id: number) => {
  //   return currentWishlist.value?.wishlistItems.some(
  //     (item: { product: { id: number } }) => item.product.id === id
  //   );
  // };

  return {
    loading,
    loadWishlist,
    wishlistItems: computed(() => currentWishlist.value?.wishlistItems),
    // isInWishlist,
    WishlistAddItem,
    WishlistRemoveItem,
  };
};
