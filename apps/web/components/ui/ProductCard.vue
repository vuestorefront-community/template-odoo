<script lang="ts" setup>
import {
  SfRating,
  SfCounter,
  SfLink,
  SfButton,
  SfIconShoppingCart,
  SfIconFavorite,
} from '@storefront-ui/vue';

defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ratingCount: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  price: {
    type: String,
    required: true,
  },
});

const NuxtLink = resolveComponent('NuxtLink');
</script>
<template>
  <div class="relative border border-neutral-200 rounded-md hover:shadow-lg">
    <div class="relative">
      <SfLink :href="slug">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          class="rounded-md"
          fit="fill"
          width="full"
          height="full"
        />
      </SfLink>
      <SfButton
        type="button"
        variant="tertiary"
        size="sm"
        square
        class="absolute bottom-0 right-0 mr-2 mb-2 bg-white border border-neutral-200 !rounded-full"
        aria-label="Add to wishlist"
      >
        <SfIconFavorite size="sm" />
      </SfButton>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm">
      <SfLink :href="slug" variant="secondary" class="no-underline">
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
      <p
        v-if="description"
        class="block py-2 font-normal leading-5 typography-text-sm text-neutral-700"
      >
        {{ description }}
      </p>
      <span class="block pb-10 pt-3 font-bold typography-text-sm"
        >${{ price }}</span
      >
      <SfButton type="button" class="absolute bottom-2" size="sm">
        <template #prefix>
          <SfIconShoppingCart size="sm" />
        </template>
        Add
      </SfButton>
    </div>
  </div>
</template>
