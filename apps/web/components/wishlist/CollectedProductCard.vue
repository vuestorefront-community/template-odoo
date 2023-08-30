<script setup lang="ts">
import { SfLink, SfButton, SfIconClose } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');
type WishlistProductCardProps = {
  id: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  name: string;
  price: number;
  specialPrice: number;
  slug: string;
};

const props = defineProps<WishlistProductCardProps>();
const { id, imageUrl, imageAlt, name, price, specialPrice, slug } =
  toRefs(props);
</script>

<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="min-w-[114px] w-[114px] overflow-hidden rounded-md">
      <SfLink :to="slug" :tag="NuxtLink">
        <NuxtImg
          class="border rounded-md border-neutral-200"
          :src="imageUrl ?? '/images/product.webp'"
          :alt="imageAlt ?? ''"
          width="114"
          height="236"
          loading="lazy"
        />
      </SfLink>
    </div>
    <div class="flex flex-col pl-4 pr-5">
      <div class="flex flex-col min-w-[180px] flex-1">
        <SfLink
          :tag="NuxtLink"
          :to="slug"
          variant="secondary"
          class="no-underline typography-text-sm sm:typography-text-lg"
        >
          {{ name }}
        </SfLink>
        <div class="flex">
          <span
            v-if="specialPrice"
            class="text-secondary-700 sm:order-1 font-bold typography-text-sm sm:typography-text-lg"
          >
            ${{ specialPrice }}
            <span
              class="text-neutral-500 ml-2 line-through typography-text-xs sm:typography-text-sm font-normal"
            >
              ${{ price }}
            </span>
          </span>
          <span
            v-else
            class="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg"
          >
            ${{ price }}
          </span>
        </div>
      </div>
    </div>
    <div>
      <SfButton
        class="!p-1 !rounded-full absolute top-2 right-1"
        type="button"
        variant="tertiary"
        size="sm"
        @click="$emit('removeFromWishlist', id)"
      >
        <SfIconClose />
      </SfButton>
    </div>
  </div>
</template>
