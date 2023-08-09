<template>
  <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-10" />
  <div class="md:grid grid-cols-12 gap-x-6">
    <section class="col-span-7 md:h-full xl:max-h-[700px]">
      <UiGallery />
    </section>
    <section class="col-span-5 grid-in-right md:mb-0">
      <div
        class="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
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
      <UiDivider class="mb-6" />
      <!-- <ProductProperties v-if="product" :product="product" /> -->
      <!-- <UiDivider class="mt-4 mb-2 md:mt-8" />
      <ProductAccordion v-if="product" :product="product" /> -->
    </section>
    <UiDivider class="mt-4 mb-2" />
  </div>
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

const breadcrumbs = [
  { name: 'home', link: '/' },
  { name: 'category', link: '/category' },
  { name: 'Athletic mens walking sneakers', link: '/product' },
];

const quantitySelectorValue = ref(1);
</script>
