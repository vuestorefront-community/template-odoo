<script setup lang="ts">
import { sdk } from '../sdk.config';

const categories = ref<object[]>([]);

if (categories.value.length === 0) {
  const { data } = await useAsyncData(
    'category',
    async () =>
      await sdk.odoo.getCategoryList({ pageSize: 12, filter: { id: [13, 14] } })
  );

  categories.value = data.value?.data?.categories?.categories || [];
}
</script>

<template>
  <LazyMainBanner />
  <LazyCategoryCard :categories="categories" />
  <LazyDisplay />
  <section class="pb-16">
    <LazyProductSlider heading="Inspired by your picks" />
  </section>
</template>
