<script setup lang="ts">
import {
  SfButton,
  SfIconArrowBack,
  SfLoaderCircular,
} from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');

defineProps<{
  backLabelDesktop: string;
  backLabelMobile: string;
  backHref: string;
  heading: string;
}>();

const isLoading = false;
</script>

<template>
  <div class="px-4 md:px-0 mb-20">
    <div class="flex justify-between mt-8 mb-10 px-4 md:px-0">
      <h1 class="font-bold typography-headline-3 md:typography-headline-2">
        checkout
      </h1>
      <SfButton
        :tag="NuxtLink"
        :to="backHref"
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
        :to="backHref"
        class="hidden md:flex"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('backToCart') }}
      </SfButton>
    </div>
    <span class="!flex justify-center my-40 h-24" v-if="isLoading">
      <SfLoaderCircular size="3xl" />
    </span>
    <div v-else>
      <div class="md:grid md:grid-cols-12 md:gap-x-6">
        <div class="col-span-7 mb-10 md:mb-0">
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <ContactInformation />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutAddress
            :heading="$t('billing.heading')"
            :description="$t('billing.description')"
            :button-text="$t('billing.addButton')"
            :saved-address="cart.billingAddress"
            type="billingAddress"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutAddress
            :heading="$t('shipping.heading')"
            :description="$t('shipping.description')"
            :button-text="$t('shipping.addButton')"
            :saved-address="cart.shippingAddress"
            type="shippingAddress"
          />
          <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
          <ShippingMethod :shipping-methods="shippingMethods" />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment
            :active-payment="activePayment"
            @update:active-payment="activePayment = $event"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        </div>
        <!-- <OrderSummary v-if="cart" :cart="cart" class="col-span-5 md:sticky md:top-20 h-fit">
        <SfButton :tag="NuxtLink" :to="paths.orderSuccess" size="lg" class="w-full mb-4 md:mb-0">
          {{ $t('placeOrder') }}
        </SfButton>
        <p class="text-sm text-center mt-4 pb-4 md:pb-0">
          <i18n-t keypath="termsInfo">
            <template #terms>
              <SfLink
                href="#"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ $t('termsAndConditions') }}
              </SfLink>
            </template>
            <template #privacyPolicy>
              <SfLink
                href="#"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ $t('privacyPolicy') }}
              </SfLink>
            </template>
          </i18n-t>
        </p>
      </OrderSummary> -->
      </div>
    </div>
  </div>
</template>
