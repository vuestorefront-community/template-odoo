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
      <div class="col-span-5 lg:sticky lg:top-20 h-fit">
        <div
          class="shadow-lg md:rounded-md md:border md:border-neutral-100"
          data-testid="order-summary"
        >
          <div
            class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4"
          >
            <p class="typography-headline-4 font-bold md:typography-headline-3">
              {{ $t('orderSummary') }}
            </p>
            <p
              class="typography-text-base font-medium"
              data-testid="total-in-cart"
            >
              (Items: 1)
            </p>
          </div>
          <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
            <div class="flex justify-between typography-text-base pb-4">
              <div class="flex flex-col grow pr-2">
                <p>{{ $t('itemsSubtotal') }}</p>
                <p class="typography-text-xs text-neutral-500">
                  {{ $t('originalPrice') }}
                </p>
                <p class="typography-text-xs text-secondary-700">
                  {{ $t('savings') }}
                </p>
                <p class="my-2">{{ $t('delivery') }}</p>
                <p>{{ $t('estimatedTax') }}</p>
              </div>
              <div class="flex flex-col text-right">
                <p data-testid="special-price">$89.95</p>
                <p class="typography-text-xs text-neutral-500">$100.99</p>
                <p class="typography-text-xs text-secondary-700">$20</p>
                <p class="my-2">$0</p>
                <p>$1.38</p>
              </div>
            </div>
            <div class="flex items-center py-4 border-t border-neutral-200">
              <p>{{ $t('promoCode') }}</p>
              <SfButton size="sm" variant="tertiary" class="ml-auto mr-2">
                {{ $t('remove') }}
              </SfButton>
              <p>$20</p>
            </div>
            <div class="flex gap-x-2 py-4 border-y border-neutral-200 mb-4">
              <SfInput
                wrapper-class="grow"
                :placeholder="$t('promoCodePlaceholder')"
              />
              <SfButton variant="secondary">{{ $t('apply') }}</SfButton>
            </div>
            <div
              class="px-3 py-1.5 bg-secondary-100 text-secondary-700 typography-text-sm rounded-md text-center mb-4"
            >
              <UiAlert class="w-full" variant="secondary">
                {{
                  $t('savingsTag', {
                    amount: `$20`,
                  })
                }}
              </UiAlert>
            </div>
            <div
              class="flex justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4"
            >
              <p>{{ $t('total') }}</p>
              <p data-testid="total">$89.95</p>
            </div>
            <UiDivider class="my-4 w-auto" />
            <SfButton
              :tag="NuxtLink"
              to="/checkout"
              size="lg"
              class="w-full mb-4 md:mb-0"
            >
              {{ $t('goToCheckout') }}
            </SfButton>
          </div>
        </div>
      </div>
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
</script>
