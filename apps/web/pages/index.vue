<script setup lang="ts">
import { useCategory } from '@/composables';

const { loadCategoryList } = useCategory();

const { categories: cat } = await loadCategoryList({
  filter: { parent: true },
});

const categories = useState<any>(() => cat || []);
</script>

<template>
  <LazyMainBanner />
  <LazyCategoryCard :categories="categories" />
  <LazyDisplay />
  <section class="pb-16">
    <LazyProductSlider heading="Inspired by your picks" />
  </section>
</template>
