<script setup lang="ts">
import {
  useCategory,
  useProductAttributes,
  useUiHelpers,
  useWishlist,
} from '@/composables';
import { Product, WishlistData } from '@erpgap/odoo-sdk-api-client';
import {
  SfButton,
  SfIconTune,
  SfLoaderCircular,
  useDisclosure,
} from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';
import { useToast } from 'vue-toastification';

const mediaQueries = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
};
const route: any = useRoute();
const { isOpen, open, close } = useDisclosure();
const toast = useToast();
const { loadProducts, loadCategory, getCategoryTree } = useCategory();
const { getRegularPrice, getSpecialPrice } = useProductAttributes();
const { getFacetsFromURL, getGroups } = useUiHelpers();
const { loadWishlist, WishlistAddItem, WishlistRemoveItem } = useWishlist();

const breadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Category', link: `Category/${route.params.id}` },
];
const attributes = await getGroups({
  pageSize: 12,
  currentPage: 1,
  search: '',
  sort: {},
  filter: {
    minPrice: null,
    maxPrice: null,
    attribValues: [],
    categorySlug: '/category/' + route.params.id,
  },
});
const { products: AllProduct, totalProducts } = await loadProducts(
  getFacetsFromURL(route.query)
);
const { category } = await loadCategory({
  id: Number(route.params.id),
});

const categories = await getCategoryTree(category);

const products = useState<any>('products', () => []);

const isLoading = ref(true);
const productsForPagination = ref([]);
const mountUrlSlugForProductVariant = (product: {
  slug: string;
  variantAttributeValues: any;
}) => {
  if (product) {
    const { slug, variantAttributeValues } = product;
    const joinedSlug = `${slug}?${variantAttributeValues
      .map(
        (variant: { attribute: { name: string }; id: number }) =>
          `${variant?.attribute?.name}=${variant?.id}&`
      )
      .join('')}`;
    return joinedSlug.slice(0, -1);
  }
};
watch(
  () => route.fullPath,
  async () => {
    isLoading.value = true;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    const { products: AllProduct, totalProducts } = await loadProducts(
      getFacetsFromURL(route.query)
    );
    products.value = AllProduct;
    isLoading.value = false;
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
const totalItems = computed(() =>
  pagination.value.totalItems === 0 ? 'No' : pagination.value.totalItems
);

const wishList = await loadWishlist();
const currentWishlist = ref<any[]>(wishList.wishlistItems);

const getProductId = (product: Product) => {
  return product?.firstVariant?.id || product.id;
};
const toggleProductToWishlist = (productId: number) => {
  if (productId) {
    products.value = products.value?.map((item: Product) => {
      if (getProductId(item) === productId) {
        item.isInWishlist = !item.isInWishlist;
      }
      return item;
    });
  }
};
const toggleWishlist = async (id: any) => {
  const isExist = currentWishlist.value?.some((item: any) => {
    return getProductId(item.product) === id;
  });

  if (isExist) {
    const wishlistItem = currentWishlist.value.find(
      (item) => item.product.id === id
    );
    toggleProductToWishlist(getProductId(wishlistItem?.product));
    const response = await WishlistRemoveItem(wishlistItem?.id);
    if (response && response.wishlistItems) {
      currentWishlist.value = response.wishlistItems;
      await loadWishlist();
      toast.success('Product has been removed from wishlist');
    }
  } else {
    toggleProductToWishlist(id);
    const response = await WishlistAddItem(id);
    if (response && response.wishlistItems) {
      currentWishlist.value = response.wishlistItems;
      await loadWishlist();
      toast.success('Product has been added to wishlist');
    }
  }
};

onMounted(() => {
  setMaxVisiblePages(isWideScreen.value);
  products.value = AllProduct;
  productsForPagination.value = totalProducts;
  isLoading.value = false;
});
</script>
<template>
  <div class="pb-20">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-14" />
    <h1 class="font-bold typography-headline-3 md:typography-headline-2 mb-10">
      All products
    </h1>
    <div class="grid grid-cols-12 lg:gap-x-6">
      <div class="col-span-12 lg:col-span-4 xl:col-span-3">
        <CategoryFilterSidebar
          class="hidden lg:block"
          :attributes="attributes"
          :categories="categories"
        />
        <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
          <template #default>
            <CategoryFilterSidebar
              class="block lg:hidden"
              @close="close"
              :attributes="attributes"
              :categories="categories"
            />
          </template>
        </LazyCategoryMobileSidebar>
      </div>
      <div class="col-span-12 lg:col-span-8 xl:col-span-9">
        <template v-if="!isLoading">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg"
              >{{ totalItems }} Products
            </span>
            <SfButton
              @click="open"
              variant="tertiary"
              class="lg:hidden whitespace-nowrap"
            >
              <template #prefix>
                <SfIconTune />
              </template>
              Filter
            </SfButton>
          </div>
          <section
            v-if="products.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
          >
            <LazyUiProductCard
              v-for="{
                id,
                name,
                firstVariant,
                image,
                isInWishlist,
              } in products"
              :key="id"
              :name="name"
              :slug="mountUrlSlugForProductVariant(firstVariant) || ''"
              :image-url="`https://vsfdemo15.labs.odoogap.com${image}`"
              :image-alt="name"
              :regular-price="getRegularPrice(firstVariant) || 250"
              :special-price="getSpecialPrice(firstVariant)"
              :is-in-wishlist="isInWishlist"
              :rating-count="123"
              :rating="Number(4)"
              :first-variant="firstVariant"
              @addOrRemoveFromWishlists="toggleWishlist"
            />
          </section>
          <CategoryEmptyState v-else />
          <LazyUiPagination
            v-if="pagination.totalPages > 1"
            class="mt-5"
            :current-page="pagination.currentPage"
            :total-items="pagination.totalItems"
            :page-size="pagination.itemsPerPage"
            :max-visible-pages="maxVisiblePages"
          />
        </template>
        <template v-else>
          <div class="w-full text-center mb-20">
            <SfLoaderCircular size="xl" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
