<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />

    <CategoryNavbar :facetsList="result" />

    <div class="main section">
      <div class="sidebar desktop-only">
        <SfLoader :class="{ loading }" :loading="loading">
          <SfAccordion
            :multiple="true"
            :open="currentCategoryNameForAccordion"
            showChevron
            transition="sf-expand"
          >
            <SfAccordionItem
              v-for="(cat, i) in categoryTree.items"
              :key="i"
              :header="cat.label"
            >
              <template>
                <SfList class="list">
                  <SfListItem
                    class="list__item"
                    v-for="(subCat, j) in cat.items"
                    :key="j"
                  >
                    <SfMenuItem
                      :count="subCat.count || ''"
                      :data-cy="`category-link_subcategory_${subCat.slug}`"
                      :label="subCat.label"
                    >
                      <template #label="{ label }">
                        <nuxt-link
                          :to="localePath(th.getCatLink(subCat))"
                          :class="
                            subCat.isCurrent ? 'sidebar--cat-selected' : ''
                          "
                        >
                          {{ label }}
                        </nuxt-link>
                      </template>
                    </SfMenuItem>
                  </SfListItem>
                </SfList>
              </template>
            </SfAccordionItem>
          </SfAccordion>
        </SfLoader>
      </div>
      <SfLoader :class="{ loading }" :loading="loading">
        <div class="products" v-if="showProducts">
          <transition-group
            v-if="isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <SfSkeleton type="image" />
           
            <SfProductCard
              data-cy="category-product-card"
              v-for="(product, i) in products"
              :key="product.id"
              :style="{ '--index': i }"
              :imageWidth="216"
              :imageHeight="288"
              :title="productGetters.getName(product)"
              :image="
                $image(
                  productGetters.getCoverImage(product),
                  216,
                  288,
                  productGetters.getImageFilename(product)
                )
              "
              :nuxtImgConfig="{ loading: 'eager', fit: 'cover', preload: true }"
              image-tag="nuxt-img"
              :regular-price="
                $n(productGetters.getPrice(product).regular, 'currency')
              "
              :special-price="
                productGetters.getPrice(product).regular !==
                productGetters.getPrice(product).special
                  ? productGetters.getPrice(product).special &&
                    $n(productGetters.getPrice(product).special, 'currency')
                  : ''
              "
              :max-rating="5"
              :score-rating="productGetters.getAverageRating(product)"
              :show-add-to-cart-button="true"
              :isInWishlist="isInWishlist({ product })"
              :isAddedToCart="isInCart({ product })"
              :link="localePath(productGetters.getSlug(product))"
              class="products__product-card"
              @click:wishlist="
                isInWishlist({ product })
                  ? removeItemFromWishList({ product: { product } })
                  : addProductToWishList(product)
              "
              @click:add-to-cart="
                addItemToCart({ product, quantity: 1 }), toggleCartSidebar()
              "
            >
              <template #image>
                <nuxt-link :to="localePath(productGetters.getSlug(product))">
                  <SfImage
                    class="sf-product-card__image"
                    :src="$image(
                      productGetters.getCoverImage(product),
                      216,
                      288,
                      productGetters.getImageFilename(product)
                    )"
                    :alt="productGetters.getName(product)"
                    loading="eager"
                    :width="216"
                    :height="288"
                    image-tag="nuxt-img"
                    :nuxt-img-config="{ fit: 'cover', preload: true }"
                  />
                </nuxt-link>
              </template>
            </SfProductCard>
          </transition-group>
          <transition-group
            v-else
            appear
            name="products__slide"
            tag="div"
            class="products__list"
          >
            <SfProductCardHorizontal
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="product.id"
              :style="{ '--index': i }"
              :imageWidth="140"
              :imageHeight="200"
              :nuxtImgConfig="{ fit: 'cover', alt: '123' }"
              image-tag="nuxt-img"
              :title="productGetters.getName(product)"
              :description="productGetters.getDescription(product)"
              :image="
                $image(
                  productGetters.getCoverImage(product),
                  140,
                  200,
                  productGetters.getImageFilename(product)
                )
              "
              :regular-price="
                $n(productGetters.getPrice(product).regular, 'currency')
              "
              :special-price="
                productGetters.getPrice(product).regular !==
                productGetters.getPrice(product).special
                  ? productGetters.getPrice(product).special &&
                    $n(productGetters.getPrice(product).special, 'currency')
                  : ''
              "
              :isInWishlist="isInWishlist({ product })"
              class="products__product-card-horizontal"
              @click:wishlist="addProductToWishList(product)"
              @click:add-to-cart="
                addItemToCart({ product, quantity: products[i].qty || 1 }),
                  toggleCartSidebar()
              "
              v-model="products[i].qty"
              :link="localePath(productGetters.getSlug(product))"
            >
              <template #actions>
                <SfButton
                  class="sf-button--text desktop-only"
                  style="margin: 0 0 1rem auto; display: block"
                  @click="addProductToWishList(product)"
                >
                  {{ $t('Save for later') }}
                </SfButton>
              </template>
            </SfProductCardHorizontal>
          </transition-group>

          <LazyHydrate on-interaction>
            <SfPagination
              v-if="!loading"
              data-cy="category-pagination"
              class="products__pagination"
              v-show="pagination.totalPages > 1"
              :current="pagination.currentPage"
              :total="pagination.totalPages"
              :visible="5"
            />
          </LazyHydrate>

          <div
            v-show="pagination.totalPages > 1"
            class="products__show-on-page"
          >
            <span class="products__show-on-page__label">{{
              $t('Show on page')
            }}</span>

            <SfSelect
              :value="pagination.itemsPerPage.toString()"
              class="products__items-per-page"
              @input="th.changeItemsPerPage"
            >
              <SfSelectOption
                v-for="option in pagination.pageOptions"
                :key="option"
                :value="option"
                class="products__items-per-page__option"
              >
                {{ option }}
              </SfSelectOption>
            </SfSelect>
          </div>
        </div>
        <div v-else key="no-results" class="before-results">
          <SfImage
            :width="256"
            :height="176"
            src="/error/error.svg"
            class="before-results__picture"
            alt="error"
            loading="lazy"
          />
          <p class="before-results__paragraph">
            {{ $t('Sorry, we didnt find what youre looking for') }}
          </p>
          <SfButton
            class="before-results__button color-secondary smartphone-only"
            @click="$emit('close')"
          >
            {{ $t('Go back') }}
          </SfButton>
        </div>
      </SfLoader>
    </div>

    <CategoryFilterSideBar :facetsList="result" />
  </div>
</template>

<script >
import CategoryFilterSideBar from "@/components/Category/FilterSideBar.vue"
import {
  SfButton,
  SfList,
  SfMenuItem,
  SfSkeleton,
  SfProductCard,
  SfHeading,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfCheckbox,
  SfSelect,
  SfProperty,
  SfBreadcrumbs,
  SfLoader,
  SfImage
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  onMounted,
  defineComponent,
  useRoute
} from '@nuxtjs/composition-api';
import {
  useCart,
  useWishlist,
  productGetters,
  useFacet,
  facetGetters
} from '@vue-storefront/odoo';
import { useCache, CacheTagPrefix } from '@vue-storefront/cache';
import { useUiHelpers, useUiState, useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import speedkitHydrate from 'nuxt-speedkit/hydrate';

export default defineComponent({
  name: 'Category',
  transition: 'fade',
  components: {
    CategoryNavbar: speedkitHydrate(() => import('@/components/Category/Navbar')),
    CategoryFilterSideBar,
    SfSelect,
    SfProperty,
    SfButton,
    SfList,
    SfSkeleton,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfHeading,
    SfAccordion,
    SfBreadcrumbs,
    SfCheckbox,
    SfLoader,
    LazyHydrate,
    SfImage
  },
  setup(props, { root }) {
    const th = useUiHelpers();
    const generic = ref('');

    const { addTags } = useCache();
    const uiState = useUiState();
    const { addItem: addItemToCart, isInCart } = useCart();
    const {
      addItem: addItemToWishlist,
      removeItem: removeItemFromWishList,
      isInWishlist
    } = useWishlist();
    const { result, search, loading } = useFacet();
    const { send } = useUiNotification();
    const route = useRoute();
    const { params, query } = route.value;

    const products = computed(() => facetGetters.getProducts(result.value));
    const categoryTree = computed(() =>
      facetGetters.getCategoryTree(result.value)
    );

    const addProductToWishList = (product) => {
      addItemToWishlist({ product })
      send({ message: "Product added to wishlist", type: 'info' });
    };

    const pagination = computed(() => facetGetters.getPagination(result.value));
    const showProducts = computed(
      () => !loading.value && products.value?.length > 0
    );

    const currentCategory = computed(() => {
      return result.value?.data?.category || [];
    });

    const currentCategoryNameForAccordion = computed(() => {
      const name =
        currentCategory.value?.parent?.name ||
        categoryTree.value?.items[0]?.label ||
        '';
      return name;
    });

    const currentRootCategory = computed(() => {
      const category = result.value?.data?.category;

      const categoryFromParent = currentCategory.value?.parent?.parent;

      return category || categoryFromParent || {};
    });

    const breadcrumbs = computed(() => {
      const breadcrumbs = facetGetters.getBreadcrumbs({
        input: {
          params,
          currentRootCategory: currentRootCategory.value
        }
      });
      if (breadcrumbs.length > 0 && breadcrumbs[0].text === 'Home')
        breadcrumbs[0].text = root.$t('Home');
      return breadcrumbs;
    });

    onSSR(async () => {
      const params = {
        pageSize: query.itemsPerPage || 12,
        ...th.getFacetsFromURL()
      };

      await search(params);

      addTags([
        {
          prefix: CacheTagPrefix.Category,
          value: currentRootCategory.value.id || params.slug_2
        }
      ]);
    });

    onMounted(() => {
      root.$scrollTo(root.$el, 2000);
    });

    return {
      ...uiState,
      currentRootCategory,
      currentCategory,
      th,
      generic,
      products,
      categoryTree,
      loading,
      productGetters,
      pagination,
      breadcrumbs,
      addProductToWishList,
      addItemToWishlist,
      removeItemFromWishList,
      addItemToCart,
      isInWishlist,
      isInCart,
      showProducts,
      result,
      currentCategoryNameForAccordion
    };
  },
  head: {
    script: [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org',
          '@type': 'Category',
          name: 'Category Page'
        }
      }
    ]
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/css/category.scss';
</style>
