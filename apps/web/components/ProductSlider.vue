<script setup lang="ts">
import { SfScrollable } from '@storefront-ui/vue';

defineProps({
  heading: String,
  text: String,
});

const products = ref([
  {
    id: 1,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 2,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 3,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 4,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 5,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 6,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 7,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 8,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 9,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
  {
    id: 10,
    name: 'Athletic mens walking sneakers',
    image: '/images/product.webp',
    slug: '/images/product.webp',
    imageAlt: 'imageAlt',
    rating: 4,
    ratingCount: 26,
    price: 89.95,
  },
]);
</script>

<template>
  <h2
    v-if="heading"
    class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2"
  >
    {{ heading }}
  </h2>
  <p class="my-4 typography-text-lg">
    {{ text }}
  </p>
  <SfScrollable
    buttons-placement="floating"
    class="items-center pb-4"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in products"
      class="min-w-[190px]"
      :key="product.id"
      :slug="product.slug"
      :name="product.name"
      :image-url="product.image"
      :image-alt="product.image"
      :regular-price="product.price"
      :rating-count="product.ratingCount"
      :rating="product.rating"
    />
  </SfScrollable>
</template>
