<script setup lang="ts">
import { Product } from '@erpgap/odoo-sdk-api-client';
import { sdk } from '../../sdk.config';

const products = useState<Product[]>('counter', () => []);

if (products.value.length === 0) {
  const { data } = await useAsyncData('counter', async () => await sdk.odoo.getProductTemplateList({ pageSize: 12, filter: { categoryId: [13] } }));
  products.value = data.value?.data.products?.products || [];
}

</script>
<template>
    <div>
        <UiBreadcrumb class="self-start mt-5 mb-14" />
        <div class="flex flex-row items-stretch ">
            <CategoryFilterSidebar class="mr-10" />

            <div class="flex flex-row flex-wrap justify-between">
                <CategoryProduct v-for="product in products" class="mb-4" :product="product" />
            </div>
        </div>
    </div>
</template>

<style lang="">

</style>
