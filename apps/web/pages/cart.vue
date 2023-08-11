<template>
  <div v-if="data" class="pb-20">
    <div
      class="flex justify-between mt-8 mb-10 px-4 md:px-0"
      data-v-inspector="layouts/checkout.vue:6:9"
    >
      <div class="w-full flex items-center justify-between">
        <h1
          class="font-bold typography-headline-3 md:typography-headline-2"
          data-v-inspector="layouts/checkout.vue:7:11"
        >
          My Cart
        </h1>
        <SfButton
          variant="tertiary"
          class="self-start"
          :tag="NuxtLink"
          to="/category/1"
          size="lg"
          @click="$emit('on-click')"
          ><SvgBackArrow />
          <span class="mt-[2.5px] hidden md:block">Back To Shopping</span>
          <span class="mt-[2.5px] md:hidden">Back</span></SfButton
        >
      </div>
    </div>
    <div
      class="lg:grid lg:grid-cols-12 md:gap-x-6"
      data-testid="cart-page-content"
    >
      <div class="col-span-7 mb-10 lg:mb-0">
        <div
          v-for="{
            id,
            attributes,
            imageUrl,
            imageAlt,
            name,
            price,
            specialPrice,
            quantity,
            slug,
          } in data"
          :key="id"
        >
          <CartCollectedProductCard
            :attributes="attributes"
            :image-url="imageUrl"
            :image-alt="imageAlt"
            :name="name ?? ''"
            :price="price"
            :special-price="specialPrice"
            :max-value="10"
            :min-value="1"
            :value="quantity"
            :slug="slug"
          />
        </div>
      </div>

      <UiOrderSummary :cart="cart" class="col-span-5 md:sticky md:top-20 h-fit">
        <SfButton
          :tag="NuxtLink"
          to="/checkout"
          size="lg"
          class="w-full mb-4 md:mb-0"
        >
          {{ $t('goToCheckout') }}
        </SfButton>
      </UiOrderSummary>
    </div>
  </div>
  <div
    v-else
    class="flex items-center justify-center flex-col pt-24 pb-32"
    data-testid="cart-page-content"
  >
    <NuxtImg
      src="/images/empty-cart.svg"
      :alt="$t('emptyCartImgAlt')"
      width="192"
      height="192"
    />
    <h2 class="mt-8">{{ $t('emptyCart') }}</h2>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfInput } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');

const data = ref([
  {
    id: 1,
    attributes: [
      {
        name: 'Size',
        label: '40',
      },
      {
        name: 'Color',
        label: 'White',
      },
    ],
    imageUrl: null,
    imageAlt: 'athletic-mens-walking-sneakers',
    maxValue: 20,
    minValue: 1,
    name: 'athletic-mens-walking-sneakers',
    price: '89.95',
    specialPrice: '100.99',
    quantity: 10,
    slug: '/product/1',
  },
]);

const cart = ref({
  length: 1,
  totalPrice: '89.95',
  subtotalRegularPrice: '100.99',
  totalCouponDiscounts: '20',
  shippingPrice: '0',
  totalTax: '1.38',
});
</script>
