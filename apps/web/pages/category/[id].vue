<script setup lang="ts">
import { sdk } from '../../sdk.config';
import { Product } from '@erpgap/odoo-sdk-api-client';
import { SfButton, SfIconTune } from '@storefront-ui/vue';

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
  <div class="pb-20">
    <UiBreadcrumb class="self-start mt-5 mb-14" />
    <h1 class="font-bold typography-headline-3 md:typography-headline-2 mb-10">
      All products
    </h1>
    <div class="flex flex-row items-stretch">
      <CategoryMobileSidebar class="lg:hidden">
        <template #default>
          <CategoryFilterSidebar />
        </template>
      </CategoryMobileSidebar>
      <div class="lg:ml-10">
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold font-headings md:text-lg"> 45 Products </span>
          <SfButton
            @click=""
            variant="tertiary"
            class="lg:hidden whitespace-nowrap"
          >
            <template #prefix>
              <SfIconTune />
            </template>
            List settings
          </SfButton>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          <UiProductCard
            v-for="product in products"
            :key="product.id"
            :name="product.name"
            :slug="product.slug"
            :image-url="`https://vsfdemo15.labs.odoogap.com${product.image}`"
            :image-alt="product.name"
            :price="product.price"
            rating-count="123"
            rating="4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=""></style>
