<template>
  <section
    data-testid="category-empty-state"
    class="flex flex-col items-center md:mt-16"
  >
    <NuxtImg
      src="/images/something-went-wrong.svg"
      alt="Image for no products found"
      width="192"
      height="192"
    />
    <p class="mt-8 font-medium">We no longer have products in this category.</p>
    <p class="mt-4">Have not found what you are looking for?</p>
    <SfButton :tag="NuxtLink" to="/" variant="secondary" class="mt-4">
      Browse products
    </SfButton>
  </section>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');
</script>
