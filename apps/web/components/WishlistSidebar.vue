<script setup lang="ts">
import { useWishlist } from '@/composables';
import '@erpgap/odoo-sdk-api-client';
import {
  SfDrawer,
  SfButton,
  SfIconClose,
  SfLoaderCircular,
} from '@storefront-ui/vue';
import { onClickOutside } from '@vueuse/core';
import { useToast } from 'vue-toastification';

const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close']);

const { loading, loadWishlist, WishlistRemoveItem } = useWishlist();
const { isOpen } = toRefs(props);
const toast = useToast();

const WishlistRef = ref();
onClickOutside(WishlistRef, () => {
  emit('close');
});

const withBase = (filepath: string) =>
  `https://vsfdemo15.labs.odoogap.com${filepath}`;

const wishlistItems: any = ref([]);
watch(isOpen, async (val) => {
  if (val) {
    const res = await loadWishlist();
    if (res && res.wishlistItems) {
      wishlistItems.value = res.wishlistItems;
    }
  }
});

const removeFromWishlist = async (id: number) => {
  const response = await WishlistRemoveItem(id);
  if (response && response.wishlistItems) {
    wishlistItems.value = response.wishlistItems;
    toast.success('Product has been removed from wishlist');
  }
};
</script>

<template>
  <div class="w-full">
    <div
      v-if="isOpen"
      class="fixed !w-screen !h-screen inset-0 bg-neutral-500 bg-opacity-50 transition-opacity duration-1000 top-index"
    />
    <div ref="WishlistRef">
      <transition
        enter-active-class="transition duration-500 ease-in-out"
        leave-active-class="transition duration-500 ease-in-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <SfDrawer
          v-show="isOpen"
          :model-value="true"
          :disable-click-away="true"
          :disable-esc="true"
          placement="right"
          class="shadow-none z-[100] w-full lg:w-[420px] bg-white"
          data-testid="category-sidebar"
        >
          <div class="flex flex-col h-full">
            <div class="p-4 flex justify-between items-center">
              <span class="font-bold text-lg text-black">Wishlist</span>
              <SfButton
                variant="tertiary"
                @click="$emit('close')"
                :aria-label="$t('closeListSettings')"
              >
                <template #prefix>
                  <SfIconClose class="text-neutral-500" />
                </template>
              </SfButton>
            </div>
            <div v-if="!loading">
              <div
                v-if="wishlistItems.length > 0"
                class="overflow-y-scroll h-[1000px] p-4 text-black no-scrollbar"
              >
                <div class="flex items-center font-medium pb-6">
                  <p class="text-gray-600 mr-1">Number of products :</p>
                  {{ wishlistItems?.length }}
                </div>
                <div v-for="{ product, id } in wishlistItems" :key="id">
                  <WishlistCollectedProductCard
                    :id="id"
                    :image-url="withBase(product.image)"
                    :image-alt="product.name"
                    :name="product.name ?? ''"
                    :price="
                      product?.firstVariant?.combinationInfoVariant?.list_price
                    "
                    :special-price="
                      product?.firstVariant?.combinationInfoVariant?.price
                    "
                    :slug="product.slug"
                    @removeFromWishlist="removeFromWishlist"
                    @close="$emit('close')"
                  />
                </div>
              </div>
              <div v-else class="h-screen" data-testid="cart-page-content">
                <div
                  class="flex items-center justify-center flex-col h-[calc(100%-100px)] text-black"
                >
                  <NuxtImg
                    src="/images/empty-cart.svg"
                    :alt="$t('emptyCartImgAlt')"
                    width="192"
                    height="192"
                  />
                  <h2 class="my-6 mb-3 font-medium">Your Wishlist is empty</h2>
                  <SfButton
                    :tag="NuxtLink"
                    to="/"
                    variant="secondary"
                    class="!ring-neutral-200"
                    @click="$emit('close')"
                  >
                    {{ $t('account.ordersAndReturns.continue') }}</SfButton
                  >
                </div>
              </div>
            </div>
            <div class="h-screen" v-else>
              <p
                class="text-black flex justify-center items-center h-[calc(100%-50px)]"
              >
                <SfLoaderCircular size="lg" />
              </p>
            </div>
          </div>
        </SfDrawer>
      </transition>
    </div>
  </div>
</template>
