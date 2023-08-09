<template>
  <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-10" />
  <div class="md:grid grid-areas-product-page grid-cols-product-page gap-x-6">
    <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
      <UiGallery />
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
          <span class="mr-1 text-white">Sale</span>
        </div>
        <h1
          class="mb-1 font-bold typography-headline-4"
          data-testid="product-name"
        >
          Athletic mens walking sneakers
        </h1>
        <div class="my-1">
          <span
            class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
            data-testid="price"
          >
            $89.95
          </span>
          <span class="text-base font-normal text-neutral-500 line-through">
            $100.99
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
          Lightweight • Non slip • Flexible outsole • Easy to wear on and off
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
              Add to cart
            </SfButton>
          </div>
          <div class="flex justify-center mt-4 gap-x-4">
            <SfButton type="button" size="sm" variant="tertiary">
              <template #prefix>
                <SfIconCompareArrows size="sm" />
              </template>
              Compare
            </SfButton>
            <SfButton type="button" size="sm" variant="tertiary">
              <SfIconFavorite size="sm" />
              Add to list
            </SfButton>
          </div>
        </div>
        <div class="flex first:mt-4">
          <SfIconPackage
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <p class="text-sm">
            <span>Free shipping,arrives by Apr 7. Want it faster? </span>
            <SfLink href="#" variant="secondary">Add an address</SfLink>
            <span> to see options</span>
          </p>
        </div>
        <div class="flex mt-4">
          <SfIconWarehouse
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <p class="text-sm">
            <span>Pickup not available at Super center. </span>
            <SfLink href="#" variant="secondary"
              >Check availability nearby</SfLink
            >
          </p>
        </div>
        <div class="flex mt-4">
          <SfIconSafetyCheck
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
          />
          <p class="text-sm">
            <span>Free 30-Day returns </span>
            <SfLink href="#" variant="secondary">Details</SfLink>
          </p>
        </div>
      </div>
    </section>
    <section class="grid-in-left-bottom md:mt-8">
      <UiDivider class="mt-10 mb-6" />
      <div class="lg:px-4" data-testid="product-properties">
        <fieldset v-if="sizes?.length" class="pb-4 flex">
          <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
          >
            Size
          </legend>
          <span
            v-for="{ label, value } in sizes"
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
        <fieldset v-if="sizes?.length" class="pb-2 flex">
          <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
          >
            Color
          </legend>
          <span
            v-for="{ label, value } in colors"
            class="mr-2 mb-2 uppercase"
            :key="value"
          >
            <SfChip
              class="min-w-[48px]"
              size="sm"
              :input-props="{
                onClick: (e) => value == selectedSize && e.preventDefault(),
              }"
              :model-value="value === selectedColor"
              @update:model-value=""
            >
              <template #prefix
                ><SfThumbnail size="sm" :style="{ background: value }"
              /></template>
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
              Product Details
            </h2>
          </template>
          <p>
            Lightweight • Non slip • Flexible outsole • Easy to wear on and off
          </p>
        </UiAccordionItem>
        <UiDivider class="my-4" />
        <UiAccordionItem
          summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
        >
          <template #summary>
            <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
              Customer Reviews
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

<script setup lang="ts">
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
} from '@storefront-ui/vue';
import { SfChip, SfThumbnail } from '@storefront-ui/vue';

const sizes = ref([
  {
    value: 36,
    label: 'M',
  },
  {
    value: 37,
    label: 'S',
  },
  {
    value: 38,
    label: 'L',
  },
  {
    value: 39,
    label: 'XL',
  },
]);
const colors = ref([
  {
    value: '#FF0000',
    label: 'red',
  },
  {
    value: '#0000ff',
    label: 'blue',
  },
]);
const selectedSize = 'S';
const selectedColor = 'red';
const productDetailsOpen = ref(true);
const breadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Category', link: '/category' },
  { name: 'Athletic mens walking sneakers', link: '/product' },
];

const quantitySelectorValue = ref(1);
</script>
