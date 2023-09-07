import { sdk } from '@/sdk.config';
import { WishlistData } from '@erpgap/odoo-sdk-api-client';

export const useWishlist: any = () => {
  const loading = ref(false);
  const error = reactive<any>({
    loadWishlist: null,
    wishlistAddItem: null,
    wishlistRemoveItem: null,
  });
  const currentWishlist = useState<WishlistData>(() => <any>[]);
  const wishlistItems = computed(() => currentWishlist.value?.wishlistItems);
  const wishlistTotalItems = computed(
    () => currentWishlist.value?.wishlistItems?.length
  );

  const loadWishlist = async () => {
    try {
      loading.value = true;
      const { data }: any = await sdk.odoo.wishlistLoad();
      currentWishlist.value = data.wishlistItems;
      return data.wishlistItems;
    } catch (err) {
      error.loadWishlist = err;
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
      error.wishlistAddItem = err;
    } finally {
      loading.value = false;
    }
  };

  const WishlistRemoveItem = async (id: number) => {
    try {
      const removeItemParams = {
        wishId: id,
      };
      const { data }: any = await sdk.odoo.wishlistRemove(removeItemParams, {
        wishlistRemove: 'customQuery',
      });
      return data.wishlistRemoveItem;
    } catch (err) {
      error.wishlistRemoveItem = err;
    }
  };

  return {
    loading,
    loadWishlist,
    wishlistItems,
    wishlistTotalItems,
    WishlistAddItem,
    WishlistRemoveItem,
    error: computed(() => error),
  };
};
