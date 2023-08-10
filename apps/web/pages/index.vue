<script setup lang="ts">
import { sdk } from '../sdk.config';

const { data } = await useAsyncData(
  'ttt',
  async () => await sdk.odoo.getProductTemplate({ id: 12 })
);
</script>

<template>
  <LazyMainBanner />
  <LazyCategoryCard />
  <LazyDisplay />
  <section class="pb-16">
    <LazyProductSlider heading="Inspired by your picks" />
  </section>
</template>
