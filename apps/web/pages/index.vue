<script setup lang="ts">
import { useCategoryList } from '@/composables';

const { responseData, loadCategoryList } = useCategoryList();

await loadCategoryList({ filter: { parent: true } });
const categoryTree = computed(() => responseData.value);
</script>

<template>
  <LazyMainBanner />
  <LazyCategoryCard :categories="categoryTree" />
  <LazyDisplay />
  <section class="pb-16">
    <LazyProductSlider heading="Inspired by your picks" />
  </section>
</template>
