<script setup lang="ts">
import { sdk } from '@/sdk.config';
import { Product } from '@erpgap/odoo-sdk-api-client';
import { SfButton, SfIconTune, useDisclosure } from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';

const mediaQueries = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
};
const { isOpen, open, close } = useDisclosure();
const breadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Category', link: '/category' },
];

const route = useRoute();
const products = ref<any[]>([]);

if (products.value.length === 0) {
  const { data } = await useAsyncData(
    'product',
    async () =>
      await sdk.odoo.getProductTemplateList({
        pageSize: 12,
        filter: { categoryId: [Number(route.params.id)] },
      })
  );
  products.value = data.value?.data.products?.products || [];
}

const mountUrlSlugForProductVariant = (product: {
  slug: any;
  variantAttributeValues: any;
}) => {
  if (product) {
    const { slug, variantAttributeValues } = product;
    const joinedSlug = `${slug}?${variantAttributeValues
      .map(
        (variant: { attribute: { name: any }; id: any }) =>
          `${variant?.attribute?.name}=${variant?.id}&`
      )
      .join('')}`;
    return joinedSlug.slice(0, -1);
  }
};

const isTabletScreen = useMediaQuery(mediaQueries.tablet);
const isWideScreen = useMediaQuery(mediaQueries.desktop);
const maxVisiblePages = ref(1);

const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1);

watch(isWideScreen, (value) => setMaxVisiblePages(value));

watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});

onMounted(() => {
  setMaxVisiblePages(isWideScreen.value);
});
</script>
<template>
  <div class="pb-20">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-14" />
    <h1 class="font-bold typography-headline-3 md:typography-headline-2 mb-10">
      All products
    </h1>
    <div class="flex flex-row items-stretch">
      <LazyCategoryMobileSidebar
        :is-open="isOpen"
        @close="close"
        class="lg:hidden"
      >
        <template #default>
          <CategoryFilterSidebar />
        </template>
      </LazyCategoryMobileSidebar>
      <div class="lg:ml-10">
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold font-headings md:text-lg"> 45 Products </span>
          <SfButton
            @click="open"
            variant="tertiary"
            class="lg:hidden whitespace-nowrap"
          >
            <template #prefix>
              <SfIconTune />
            </template>
            {{ $t('listSettings') }}
          </SfButton>
        </div>
        <section
          v-if="products"
          class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
        >
          <LazyUiProductCard
            v-for="product in products"
            :key="product.id"
            :name="product.name"
            :slug="mountUrlSlugForProductVariant(product.firstVariant)"
            :image-url="`https://vsfdemo15.labs.odoogap.com${product.image}`"
            :image-alt="product.name"
            :price="product.price.toString()"
            :rating-count="123"
            :rating="Number(4)"
          />
        </section>
        <LazyUiPagination
          class="mt-5"
          :current-page="1"
          :total-items="102"
          :page-size="6"
          :max-visible-pages="maxVisiblePages"
        />
      </div>
    </div>
  </div>
</template>
