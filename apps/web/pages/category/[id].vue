<script setup>
import { sdk } from '../../sdk.config';
import { SfButton, SfIconTune } from '@storefront-ui/vue';
// import { Product } from '@erpgap/odoo-sdk-api-client';
import { useMediaQuery } from '@vueuse/core';

const mediaQueries = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
};

const breadcrumbs = [
  { name: 'home', link: '/' },
  { name: 'category', link: '/category' },
];

const isTabletScreen = useMediaQuery(mediaQueries.tablet);
const isWideScreen = useMediaQuery(mediaQueries.desktop);
const maxVisiblePages = ref(1);

const setMaxVisiblePages = (isWide) => (maxVisiblePages.value = isWide ? 5 : 1);

watch(isWideScreen, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isWideScreen.value));
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});

const products = useState('product', () => []);

if (products.value.length === 0) {
  const { data } = await useAsyncData(
    'product',
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
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-14" />
    <h1 class="font-bold typography-headline-3 md:typography-headline-2 mb-10">
      All products
    </h1>
    <div class="flex flex-row items-stretch">
      <LazyCategoryMobileSidebar class="lg:hidden">
        <template #default>
          <CategoryFilterSidebar />
        </template>
      </LazyCategoryMobileSidebar>
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
        <section
          v-if="products"
          class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
        >
          <LazyUiProductCard
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
