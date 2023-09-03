<script lang="ts" setup>
import {
  useCart
} from '@/composables';
import { SfButton, SfIconArrowBack } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');

const { loadCartDetails } = useCart();

const { cart } = await loadCartDetails();

const route: any = useRoute();

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

</script>

<template>
  <div v-if="cart.order.orderLines" class="pb-20">
    <div class="flex justify-between mt-8 mb-10">
      <h1 class="font-bold typography-headline-3 md:typography-headline-2">
        Cart
      </h1>
      <SfButton
        :tag="NuxtLink"
        to="/cart"
        class="flex md:hidden whitespace-nowrap"
        size="sm"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('back') }}
      </SfButton>
      <SfButton
        :tag="NuxtLink"
        to="/cart"
        class="hidden md:flex"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('backToShopping') }}
      </SfButton>
    </div>
    <div
      class="lg:grid lg:grid-cols-12 md:gap-x-6"
      data-testid="cart-page-content"
    >
      <div class="col-span-7 mb-10 lg:mb-0">
        <div
          v-for="
            orderLine
           in cart.order.orderLines"
        >
          <CartCollectedProductCard
            :id="orderLine.product.id"
            :displayName="orderLine.product.combinationInfo.display_name"
            :imageUrl="orderLine.product.image"
            :imageAlt="orderLine.product.imageFilename"
            :attributes="orderLine.product.attributeValues"
            :price="orderLine.product.combinationInfo.price"
            :listPrice="orderLine.product.combinationInfo.list_price"
            :minValue="1"
            :maxValue="10"
            :quantit="orderLine.quantity"
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
