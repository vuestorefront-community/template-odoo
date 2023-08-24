<script setup lang="ts">
import { useCategory, useProductAttributes, useUiHelpers } from '@/composables';
import { ProductList, Attribute } from '@erpgap/odoo-sdk-api-client';
import { SfButton, SfIconTune, useDisclosure } from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';

const mediaQueries = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
};
const route: any = useRoute();
const { isOpen, open, close } = useDisclosure();
const { loading, loadProducts, loadCategory, getCategoryTree } = useCategory();
const { getRegularPrice, getSpecialPrice } = useProductAttributes();
const { getFacetsFromURL, getGroups } = useUiHelpers();

const breadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Category', link: `Category/${route.params.id}` },
];

const {
  products: AllProduct,
  attributes: attrs,
  totalProducts,
} = await loadProducts(getFacetsFromURL(route.query));
const { category } = await loadCategory({
  id: Number(route.params.id),
});
const attributes = await getGroups(attrs);
const categories = await getCategoryTree(category);

const products = useState<any>('products');
const productLoading = ref(true);
const productsForPagination = ref([]);
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
watch(
  () => route.fullPath,
  async () => {
    productLoading.value = true;
    const { products: AllProduct, totalProducts } = await loadProducts(
      getFacetsFromURL(route.query)
    );
    products.value = AllProduct;
    productLoading.value = false;
    productsForPagination.value = totalProducts;
  },
  { deep: true }
);

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

const getPagination = (totalProducts: any) => {
  const itemsPerPage = totalProducts.value.input?.pageSize || 12;

  return {
    currentPage: 1,
    totalPages: Math.ceil(totalProducts.value / itemsPerPage) || 1,
    totalItems: totalProducts.value,
    itemsPerPage,
    pageOptions: [5, 12, 15, 20],
  };
};
const pagination = computed(() => getPagination(productsForPagination));
watch(
  () => route.fullPath,
  () => {
    getPagination(productsForPagination);
  },
  { deep: true }
);

onMounted(() => {
  setMaxVisiblePages(isWideScreen.value);
  products.value = AllProduct;
  productsForPagination.value = totalProducts;
  productLoading.value = false;
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
          <CategoryFilterSidebar
            :attributes="attributes"
            :categories="categories"
          />
        </template>
      </LazyCategoryMobileSidebar>
      <template v-if="!productLoading">
        <div v-if="products.length > 0" class="lg:ml-10">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg"
              >{{ pagination.totalItems }} Products
            </span>
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
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
          >
            <LazyUiProductCard
              v-for="{ id, name, firstVariant, image } in products"
              :key="id"
              :name="name"
              :slug="mountUrlSlugForProductVariant(firstVariant) || ''"
              :image-url="`https://vsfdemo15.labs.odoogap.com${image}`"
              :image-alt="name"
              :regular-price="getRegularPrice(firstVariant) || 250"
              :special-price="getSpecialPrice(firstVariant)"
              :rating-count="123"
              :rating="Number(4)"
            />
          </section>
          <LazyUiPagination
            v-if="pagination.totalPages > 1"
            class="mt-5"
            :current-page="pagination.currentPage"
            :total-items="pagination.totalItems"
            :page-size="pagination.itemsPerPage"
            :max-visible-pages="maxVisiblePages"
          />
        </div>
        <div class="min-w-full" v-else>
          <CategoryEmptyState class="text-center" />
        </div>
      </template>
      <template v-else>
        <div class="w-full text-center">Loading Products...</div>
      </template>
    </div>
  </div>
</template>
