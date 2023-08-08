<template>
  <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-14" />
  <div class="md:grid gap-x-6 grid-areas-product-page grid-cols-product-page">
    <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
      <Gallery images="" />
    </section>
    <!-- <section class="mb-10 grid-in-right md:mb-0">
          <UiPurchaseCard v-if="product" :product="product" />
        </section>
        <section class="grid-in-left-bottom md:mt-8">
          <UiDivider class="mb-6" />
          <ProductProperties v-if="product" :product="product" />
          <UiDivider class="mt-4 mb-2 md:mt-8" />
          <ProductAccordion v-if="product" :product="product" />
        </section>
        <UiDivider class="mt-4 mb-2" /> -->
  </div>
</template>

<script setup lang="ts">
const breadcrumbs = [
  { name: 'home', link: '/' },
  { name: 'category', link: '/category' },
  { name: 'Athletic mens walking sneakers', link: '/product' },
];
</script>
