<template>
  <div id="product">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="product">
      <LazyHydrate when-idle>
        <SfGallery
          :images="productGallery"
          :imageWidth="422"
          :imageHeight="644"
          class="product__gallery"
          :nuxtImgConfig="{ fit: 'cover' }"
          :thumb-nuxt-img-config="{ fit: 'cover' }"
          image-tag="nuxt-img"
          thumb-image-tag="nuxt-img"
        />
      </LazyHydrate>
      <div class="product__info">
        <div class="product__header">
          <SfHeading
            :title="productGetters.getName(product)"
            :level="3"
            class="sf-heading--no-underline sf-heading--left"
          />
          <SfIcon
            icon="drag"
            size="xxl"
            color="var(--c-text-disabled)"
            class="product__drag-icon smartphone-only"
          />
        </div>
        <div class="product__price-and-rating">
          <SfPrice
            :regular="$n(productGetters.getPrice(product).regular, 'currency')"
            :special="
              productGetters.getPrice(product).special &&
              $n(productGetters.getPrice(product).special, 'currency')
            "
          />
          <div>
            <div class="product__rating">
              <SfRating :score="averageRating" :max="5" />
              <a v-if="!!totalReviews" href="#" class="product__count">
                ({{ totalReviews }})
              </a>
            </div>
            <SfButton data-cy="product-btn_read-all" class="sf-button--text">{{
              $t('Read all reviews')
            }}</SfButton>
          </div>
        </div>
        <div>
          <SfButton
            data-cy="product-btn_size-guide"
            class="sf-button--text desktop-only product__guide"
          >
            {{ $t('Size guide') }}
          </SfButton>

          <div v-if="options.select">
            <SfSelect
              v-for="(select, selectKey) in options.select"
              :key="selectKey"
              class="sf-select--underlined"
              :value="$route.query[select.label]"
              :label="select.label"
              required
              @input="(selected) => updateFilter({ [select.label]: selected })"
            >
              <SfSelectOption
                :key="`${selectKey}_${itemKey}`"
                :value="item.value"
                :label="item.label"
                v-for="(item, itemKey) in select.values"
              >
              </SfSelectOption>
            </SfSelect>
          </div>

          <div v-if="options.radio">
            <template v-for="(radio, radioKey) in options.radio">
              <p class="product__radio-label" :key="radioKey">
                {{ radio.label }}:
              </p>
              <SfRadio
                class="sf-radio--transparent"
                v-for="(item, itemKey) in radio.values"
                required
                :key="`${radioKey}_${itemKey}`"
                :selected="$route.query[radio.label]"
                :name="radio.label"
                :value="item.value"
                :label="item.label"
                @change="updateFilter({ [radio.label]: item.value })"
              />
            </template>
          </div>

          <div v-if="options.color" class="product__colors desktop-only">
            <template v-for="(option, colorKey) in options.color">
              <p class="product__color-label" :key="colorKey">
                {{ $t('Color') }}:
              </p>

              <SfColor
                required
                v-for="(color, itemKey) in option.values"
                :key="`${colorKey}_${itemKey}`"
                :color="color.label"
                class="product__color"
                :selected="checkSelected(option.label, color.value)"
                @click="updateFilter({ [option.label]: color.value })"
              >
              </SfColor>
            </template>
          </div>

          <SfAddToCart
            data-cy="product-cart_add"
            :stock="stock"
            :disabled="loading || !allOptionsSelected"
            class="product__add-to-cart"
            @click="handleAddToCart()"
          />
        </div>

        <LazyHydrate when-idle>
          <SfTabs :open-tab="1" class="product__tabs">
            <SfTab data-cy="product-tab_description" :title="$t('Description')">
              <p class="product__description desktop-only">
                {{ description }}
              </p>
            </SfTab>
            <SfTab :title="$t('Read reviews')" data-cy="product-tab_reviews">
              <SfReview
                v-for="review in reviews"
                :key="reviewGetters.getReviewId(review)"
                :author="reviewGetters.getReviewAuthor(review)"
                :date="reviewGetters.getReviewDate(review)"
                :message="reviewGetters.getReviewMessage(review)"
                :max-rating="5"
                :rating="reviewGetters.getReviewRating(review)"
                :char-limit="250"
                read-more-text="Read more"
                hide-full-text="Read less"
                class="product__review"
              />
            </SfTab>
            <SfTab
              :title="$t('Additional Information')"
              data-cy="product-tab_additional"
              class="product__additional-info"
            >
              <div class="product__additional-info">
                <p class="product__additional-info__title">
                  {{ $t('Brand') }}
                </p>
                <p>{{ brand }}</p>
                <p class="product__additional-info__title">
                  {{ $t('Instruction1') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction2') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction3') }}
                </p>
                <p>{{ careInstructions }}</p>
              </div>
            </SfTab>
          </SfTabs>
        </LazyHydrate>
      </div>
    </div>

    <LazyHydrate when-visible>
      <RelatedProducts
        :products="relatedProducts"
        :loading="relatedLoading"
        :title="$t('Match it with')"
      />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <MobileStoreBanner />
    </LazyHydrate>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfRadio,
  SfIcon,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfReview,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfColorPicker,
  SfLoader
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { ref, computed, reactive } from '@nuxtjs/composition-api';
import { useCache, CacheTagPrefix } from '@vue-storefront/cache';
import {
  useProduct,
  useCart,
  productGetters,
  useReview,
  useProductVariant,
  reviewGetters,
  facetGetters
} from '@vue-storefront/odoo';

import { onSSR } from '@vue-storefront/core';
import { useRoute } from '@nuxtjs/composition-api';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiHelpers, useUiState } from '~/composables';

export default {
  name: 'Product',
  transition: 'fade',
  setup(props, { root }) {
    const qty = ref(1);
    const th = useUiHelpers();
    const { id } = root.$route.params;
    const { path } = useRoute().value;

    const { query } = root.$route;
    const { size, color } = root.$route.query;
    const configuration = reactive({ size, color });
    const {
      products,
      search,
      loading: productloading
    } = useProduct(`products-${path}`);
    const { searchRealProduct, productVariants, realProduct, elementNames } =
      useProductVariant(query);
    const { products: relatedProducts, loading: relatedLoading } =
      useProduct('relatedProducts');
    const { addItem, loading } = useCart();
    const { addTags } = useCache();
    const { toggleCartSidebar } = useUiState();

    const { reviews: productReviews } = useReview('productReviews');

    const product = computed(() => {
      return {
        ...products.value,
        realProduct: realProduct.value
      };
    });

    const options = computed(() =>
      productGetters.getAttributes(product.value, ['color', 'size'])
    );
    const description = computed(() =>
      productGetters.getDescription(product.value)
    );
    const properties = computed(() =>
      productGetters.getProperties(product.value)
    );
    const code = computed(() => productGetters.getCode(product.value));

    const breadcrumbs = computed(() => {
      const breadcrumbs = facetGetters.getBreadcrumbsByProduct(product.value);

      if (breadcrumbs.length > 0 && breadcrumbs[0].text === 'Home')
        breadcrumbs[0].text = root.$t('Home');
      return breadcrumbs;
    });

    const reviews = computed(() =>
      reviewGetters.getItems(productReviews.value)
    );

    const productGallery = computed(() =>
      productGetters.getGallery(product.value).map((img) => ({
        mobile: {
          url: root.$image(img.small, 128, 128, product.value.imageFilename)
        },
        desktop: {
          url: root.$image(img.normal, 422, 644, product.value.imageFilename)
        },
        big: {
          url: root.$image(img.big, 422, 644, product.value.imageFilename)
        },
        alt: product.value.name || 'alt'
      }))
    );

    onSSR(async () => {
      await search({
        slug: th.pathToSlug(),
        customQuery: { getProductTemplate: 'customGetProduct' }
      });

      await searchRealProduct({
        productTemplateId: products.value.id,
        combinationIds: Object.values(root.$route.query)
      });
      addTags([{ prefix: CacheTagPrefix.Product, value: id }]);
    });

    const updateFilter = (filter) => {
      root.$router.push({
        path: root.localePath(root.$route.path),
        query: { ...root.$route.query, ...filter }
      });
    };

    const handleAddToCart = async () => {
      const params = {
        product: product.value,
        quantity: 1
      };

      await addItem(params);

      toggleCartSidebar();
    };

    const allOptionsSelected = computed(() => {
      let keys = [];
      Object.keys(options.value).forEach((item) => {
        keys = [
          ...options.value[item].map((element) => element.label),
          ...keys
        ];
      });
      const queryParams = Object.keys(root.$route.query);

      return keys.every((param) => queryParams.includes(param));
    });

    const checkSelected = (attribute, value) => {
      return root.$route.query[attribute] === value;
    };

    return {
      th,
      productloading,
      breadcrumbs,
      allOptionsSelected,
      checkSelected,
      elementNames,
      updateFilter,
      configuration,
      product,
      code,
      description,
      properties,
      reviews,
      reviewGetters,
      averageRating: computed(() =>
        productGetters.getAverageRating(product.value)
      ),
      totalReviews: computed(() =>
        productGetters.getTotalReviews(product.value)
      ),
      relatedProducts: computed(() =>
        productGetters.getFiltered(relatedProducts.value, { master: true })
      ),
      relatedLoading,
      options,
      qty,
      addItem,
      loading,
      productGetters,
      productVariants,
      productGallery,
      toggleCartSidebar,
      handleAddToCart
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfRadio,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfReview,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    SfLoader,
    RelatedProducts,
    MobileStoreBanner,
    SfColorPicker,
    LazyHydrate
  },
  data() {
    return {
      stock: 5,
      detailsIsActive: false,
      brand:
        'Brand name is the perfect pairing of quality and design. This label creates major everyday vibes with its collection of modern brooches, silver and gold jewellery, or clips it back with hair accessories in geo styles.',
      careInstructions: 'Do not wash!'
    };
  },
  head() {
    return {
      title: this.product?.jsonLdname,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product?.description
        },
        { hid: 'twitter-site', name: 'twitter:site', content: '@greenmind' },
        {
          hid: 'twitter-type',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: this.product?.combinationInfo?.display_name || ''
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: this.product?.description || ''
        },
        {
          hid: 'twitter-image',
          name: 'twitter:image',
          content: this.productGallery?.[0]?.desktop?.url || ''
        },
        {
          hid: 'description',
          name: 'description',
          content: this.product?.description
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: this.product?.jsonLd
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/css/product.scss';
</style>
