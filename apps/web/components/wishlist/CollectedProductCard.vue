<script setup lang="ts">
import { SfLink, SfButton } from '@storefront-ui/vue';

type WishlistProductCardProps = {
  imageUrl?: string | null;
  imageAlt?: string | null;
  name: string;
  price: number;
  specialPrice: string;
  slug: string;
};

defineProps<WishlistProductCardProps>();
const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="relative overflow-hidden rounded-md">
      <SfLink :tag="NuxtLink" to="/product/1">
        <NuxtImg
          class="border rounded-md border-neutral-200"
          :src="imageUrl ?? '/images/product.webp'"
          :alt="imageAlt ?? ''"
          width="140"
          height="236"
          loading="lazy"
        />
      </SfLink>
    </div>
    <div class="flex flex-col pl-4">
      <div class="flex flex-col min-w-[180px] flex-1">
        <SfLink
          :tag="NuxtLink"
          to="/product/1"
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
      <div>
        <SfButton type="button" variant="secondary" size="sm">
        Remove
      </SfButton>
      </div>
    </div>
  </div>
</template>
