<script setup lang="ts">
import { useCategory } from '@/composables';

const { loadCategoryList } = useCategory();

const { categories } = await loadCategoryList({ filter: { parent: true } });

const filteredCategories = computed(() =>
  categories?.filter(
    (category: any) => category.name === 'WOMEN' || category.name === 'MEN'
  )
);
</script>

<template>
  <LazyMainBanner />
  <LazyCategoryCard :categories="filteredCategories" />
  <LazyDisplay />
  <section class="pb-16">
    <LazyProductSlider heading="Inspired by your picks" />
  </section>
</template>
