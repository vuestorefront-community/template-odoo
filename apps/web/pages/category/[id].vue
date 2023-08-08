<script setup lang="ts">
import { sdk } from '../../sdk.config';
import { Product } from '@erpgap/odoo-sdk-api-client';

const breadcrumbs: Breadcrumb[] = [
  { name: 'home', link: '/' },
  { name: 'allProducts', link: '/category' },
];

const products = useState<Product[]>('counter', () => []);

if (products.value.length === 0) {
  const { data } = await useAsyncData(
    'counter',
    async () =>
      await sdk.odoo.getProductTemplateList({
        pageSize: 12,
        filter: { categoryId: [13] },
      })
  );
  products.value = data.value?.data.products?.products || [];
}
</script>

<template>
    <CategoryPageContent
      v-if="products"
      title="All Products"
      total-products="12"
      :products="products"
    >
      <template #sidebar>
        <CategoryTree
          :categories="products"
          :parent="{ name: 'All Products', href: '/' }"
        />
        <CategorySorting />
        <CategoryFilters :facets="products" />
      </template>
    </CategoryPageContent>
</template>

<style lang=""></style>
