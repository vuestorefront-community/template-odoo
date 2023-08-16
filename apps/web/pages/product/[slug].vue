<script setup lang="ts">
import { sdk } from '@/sdk.config';
import {
  SfButton,
  SfCounter,
  SfLink,
  SfRating,
  SfIconSafetyCheck,
  SfIconCompareArrows,
  SfIconWarehouse,
  SfIconPackage,
  SfIconFavorite,
  SfIconSell,
  SfIconShoppingCartCheckout,
  SfIconShoppingCart,
  SfChip,
  SfThumbnail,
} from '@storefront-ui/vue';

const route = useRoute();
const product = ref<any>();

const { data } = await sdk.odoo.getProductTemplate({
  slug: `/product/${route.params.slug}`,
});

if (data.product) {
  product.value = data.product;
}

const breadcrumbs = computed(() => {
  return [
    { name: 'Home', link: '/' },
    { name: 'Category', link: '/category' },
    { name: product.value?.name, link: '/product' },
  ];
});

const getRegularPrice = (product: {
  firstVariant: { combinationInfoVariant: { list_price: any } };
}) => {
  if (product.firstVariant && product.firstVariant.combinationInfoVariant) {
    return product.firstVariant.combinationInfoVariant.list_price;
  }
};

const getSpecialPrice = (product: {
  firstVariant: {
    combinationInfoVariant: { has_discounted_price: any; price: any };
  };
}) => {
  if (
    product.firstVariant &&
    product.firstVariant.combinationInfoVariant.has_discounted_price
  ) {
    return product.firstVariant.combinationInfoVariant.price;
  }
};

const withBase = (filepath: string) =>
  `https://vsfdemo15.labs.odoogap.com${filepath}`;
const images = computed(() => {
  return [
    {
      imageSrc: withBase(product.value?.image),
      imageThumbSrc: withBase(product.value?.image),
      alt: product.value?.name,
    },
  ];
});

const selectedSize = 'S';
const selectedColor = 'red';
const selectedMaterials = '';
const productDetailsOpen = ref(true);
const quantitySelectorValue = ref(1);

const getAllSizes = computed(() => {
  const sizes = product.value?.attributeValues?.filter((item: any) => {
    return item.attribute.name === 'Size';
  });
  return sizes.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
});

const getAllColors = computed(() => {
  const colors = product.value?.attributeValues?.filter((item: any) => {
    return item.attribute.name === 'Color';
  });
  return colors.map((item: any) => {
    return {
      id: item.id,
      value: item.name,
      label: item.name,
    };
  });
});

const getAllMaterials = computed(() => {
  const materials = product.value?.attributeValues?.filter((item: any) => {
    return item.attribute.name === 'Material';
  });
  return materials.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
});

onMounted(() => {});
</script>

<template>
  <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-10" />
  <div class="md:grid grid-areas-product-page grid-cols-product-page gap-x-6">
    <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
      <LazyUiGallery :images="images" />
    </section>
    <section class="col-span-5 grid-in-right md:mb-0">
      <div
        class="pt-6 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
        data-testid="purchase-card"
      >
        <div
          class="inline-flex items-center justify-center font-medium rounded-none bg-secondary-800 text-sm p-1.5 gap-1 mb-4"
        >
          <SfIconSell color="white" size="sm" class="mr-1" />
          <span class="mr-1 text-white">{{ $t(`sale`) }}</span>
        </div>
        <h1
          class="mb-1 font-bold typography-headline-4"
          data-testid="product-name"
        >
          {{ product.name }}
        </h1>
        <div
          class="my-1"
          v-if="
            product.firstVariant &&
            product.firstVariant.combinationInfoVariant.has_discounted_price
          "
        >
          <span
            class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
            data-testid="price"
          >
            ${{ getRegularPrice(product) }}
          </span>
          <span class="text-base font-normal text-neutral-500 line-through">
            ${{ getSpecialPrice(product) }}
          </span>
        </div>
        <div v-else class="my-1">
          <span
            class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
            data-testid="price"
          >
            ${{ getRegularPrice(product) }}
          </span>
        </div>
        <div class="inline-flex items-center mt-4 mb-2">
          <SfRating size="xs" :value="4" :max="5" />
          <SfCounter class="ml-1" size="xs">26</SfCounter>
          <SfLink
            href="#"
            variant="secondary"
            class="ml-2 text-xs text-neutral-500"
          >
            26 reviews
          </SfLink>
        </div>
        <p
          class="mb-4 font-normal typography-text-sm"
          data-testid="product-description"
        >
          {{ product.description }}
        </p>
        <div class="py-4 mb-4 border-gray-200 border-y">
          <div
            class="w-full mb-4 bg-primary-200 p-2 rounded-md text-center text-primary-700"
          >
            <SfIconShoppingCartCheckout />
            1 product in cart
          </div>
          <div class="flex flex-col md:flex-row flex-wrap gap-4">
            <UiQuantitySelector
              :value="quantitySelectorValue"
              class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
            />
            <SfButton
              type="button"
              size="lg"
              class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
            >
              <template #prefix>
                <SfIconShoppingCart size="sm" />
              </template>
              {{ $t('addToCart') }}
            </SfButton>
          </div>
          <div class="flex justify-center mt-4 gap-x-4">
            <SfButton type="button" size="sm" variant="tertiary">
              <template #prefix>
                <SfIconCompareArrows size="sm" />
              </template>
              {{ $t('compare') }}
            </SfButton>
            <SfButton type="button" size="sm" variant="tertiary">
              <SfIconFavorite size="sm" />
              {{ $t('addToList') }}
            </SfButton>
          </div>
        </div>
        <div class="flex first:mt-4">
          <SfIconPackage
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <p class="text-sm">
            <i18n-t keypath="additionalInfo.shipping">
              <template #addAddress>
                <SfLink href="#" variant="secondary">{{
                  $t('additionalInfo.addAddress')
                }}</SfLink>
              </template>
            </i18n-t>
          </p>
        </div>
        <div class="flex mt-4">
          <SfIconWarehouse
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <p class="text-sm">
            <i18n-t keypath="additionalInfo.pickup">
              <template #checkAvailability>
                <SfLink href="#" variant="secondary">{{
                  $t('additionalInfo.checkAvailability')
                }}</SfLink>
              </template>
            </i18n-t>
          </p>
        </div>
        <div class="flex mt-4">
          <SfIconSafetyCheck
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <i18n-t keypath="additionalInfo.returns">
            <template #details>
              <SfLink href="#" variant="secondary">{{
                $t('additionalInfo.details')
              }}</SfLink>
            </template>
          </i18n-t>
        </div>
      </div>
    </section>
    <section class="grid-in-left-bottom md:mt-8">
      <UiDivider class="mt-10 mb-6" />
      <div class="lg:px-4" data-testid="product-properties">
        <fieldset v-if="getAllSizes && getAllSizes?.length" class="pb-4 flex">
          <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
          >
            Size
          </legend>
          <span
            v-for="{ label, value } in getAllSizes"
            class="mr-2 mb-2 uppercase"
            :key="value"
          >
            <SfChip
              class="min-w-[48px]"
              size="sm"
              :input-props="{
                onClick: (e) => value == selectedSize && e.preventDefault(),
              }"
              :model-value="value === selectedSize"
              @update:model-value=""
            >
              {{ label }}
            </SfChip>
          </span>
        </fieldset>
        <fieldset v-if="getAllSizes && getAllSizes?.length" class="pb-2 flex">
          <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
          >
            Color
          </legend>
          <span
            v-for="{ id, label, value } in getAllColors"
            class="mr-2 mb-2 uppercase"
            :key="id"
          >
            <SfChip
              class="min-w-[48px]"
              size="sm"
              :input-props="{
                onClick: (e) => value == selectedColor && e.preventDefault(),
              }"
              :model-value="id === selectedColor"
              @update:model-value=""
            >
              <template #prefix>
                <SfThumbnail size="sm" :style="{ background: value }" />
              </template>
              {{ label }}
            </SfChip>
          </span>
        </fieldset>
        <fieldset
          v-if="getAllMaterials && getAllMaterials?.length"
          class="pb-4 flex"
        >
          <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
          >
            Material
          </legend>
          <span
            v-for="{ label, value } in getAllMaterials"
            class="mr-2 mb-2 uppercase"
            :key="value"
          >
            <SfChip
              class="min-w-[48px]"
              size="sm"
              :input-props="{
                onClick: (e) =>
                  value == selectedMaterials && e.preventDefault(),
              }"
              :model-value="value === selectedMaterials"
              @update:model-value=""
            >
              {{ label }}
            </SfChip>
          </span>
        </fieldset>
      </div>
      <UiDivider class="my-4 md:mt-6" />
      <div data-testid="product-accordion">
        <UiAccordionItem
          summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
          v-model="productDetailsOpen"
        >
          <template #summary>
            <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
              {{ $t('productDetails') }}
            </h2>
          </template>
          <p>
            {{ product.description }}
          </p>
        </UiAccordionItem>
        <UiDivider class="my-4" />
        <UiAccordionItem
          summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
        >
          <template #summary>
            <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
              {{ $t('customerReviews') }}
            </h2>
          </template>
          <p>
            Lightweight • Non slip • Flexible outsole • Easy to wear on and off
          </p>
        </UiAccordionItem>
      </div>
    </section>
    <UiDivider class="mt-4 mb-2" />
  </div>
  <section class="lg:mx-4 mt-28 mb-20">
    <ProductSlider text="Recommended with this product" />
  </section>
</template>
