<template>
  <div
    class="border border-neutral-200 rounded-md hover:shadow-lg flex-auto flex-shrink-0"
    data-testid="product-card"
  >
    <div class="relative">
      <SfLink :tag="NuxtLink" to="/">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          class="object-cover rounded-md aspect-square w-full h-full"
          data-testid="image-slot"
          width="190"
          height="190"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm">
      <SfLink :tag="NuxtLink" to="/" class="no-underline" variant="secondary">
        {{ name }}
      </SfLink>
      <div class="flex items-center pt-1">
        <SfRating size="xs" :value="rating ?? 0" :max="5" />
        <SfLink
          to="#"
          variant="secondary"
          :tag="NuxtLink"
          class="ml-1 no-underline"
        >
          <SfCounter size="xs">{{ ratingCount }}</SfCounter>
        </SfLink>
      </div>
      <span
        class="block pb-2 pt-4 font-bold typography-text-sm"
        data-testid="product-card-vertical-price"
      >
        ${{ price }}
      </span>
      <SfButton type="button" size="sm">
        <template #prefix>
          <SfIconShoppingCart size="sm" />
        </template>
        Add
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SfLink,
  SfRating,
  SfCounter,
  SfButton,
  SfIconShoppingCart,
} from '@storefront-ui/vue';

defineProps({
  imageUrl: String,
  imageAlt: String,
  name: String,
  ratingCount: String,
  rating: Number,
  price: String,
});

const NuxtLink = resolveComponent('NuxtLink');
</script>
