<template>
  <div>
    <SfHeading
      :level="3"
      :title="$t('Payment')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfTable class="sf-table--bordered table desktop-only">
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">{{
          $t('Item')
        }}</SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
        >
          {{ $t(tableHeader) }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in products"
        :key="index"
        class="table__row"
      >
        <SfTableData class="table__image">
          <SfImage
            :width="256"
            :height="176"
            :src="
              $image(
                cartGetters.getItemImage(product),
                256,
                176,
                cartGetters.getItemImageFilename(product)
              )
            "
            :alt="cartGetters.getItemName(product)"
          />
        </SfTableData>
        <SfTableData class="table__data table__description table__data">
          <div class="product-title">
            {{ cartGetters.getItemName(product) }}
          </div>
          <div class="product-sku">{{ cartGetters.getItemSku(product) }}</div>
        </SfTableData>
        <SfTableData
          class="table__data"
          v-for="(value, key) in cartGetters.getItemAttributes(product, [
            'size',
            'color',
          ])"
          :key="key"
        >
          {{ value }}
        </SfTableData>
        <SfTableData class="table__data">{{
          cartGetters.getItemQty(product)
        }}</SfTableData>
        <SfTableData class="table__data price">
          <SfPrice
            :regular="$n(cartGetters.getItemPrice(product).regular, 'currency')"
            :special="
              cartGetters.getItemPrice(product).regular !== cartGetters.getItemPrice(product).special ?
              cartGetters.getItemPrice(product).special &&
              $n(cartGetters.getItemPrice(product).special, 'currency') : ''
            "
            class="product-price"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
    <div class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <SfProperty
            :name="$t('Sub Total')"
            :value="
              $n(
                totals.special > 0 ? totals.special : totals.subtotal,
                'currency'
              )
            "
            class="sf-property--full-width property"
          />
        </div>

        <SfDivider />

        <SfProperty
          :name="$t('Total Price')"
          :value="$n(totals.total, 'currency')"
          class="
            sf-property--full-width sf-property--large
            summary__property-total
          "
        />

        <SfHeading
          :level="3"
          :title="$t('Choose payment provider')"
          class="sf-heading--left sf-heading--no-underline title"
        />

        <SfRadio
          v-for="provider in providerList"
          :key="provider.id"
          :label="$t(provider.name)"
          :value="String(provider.id)"
          :selected="String(selectedProvider.id)"
          name="shippingMethod"
          class="form__radio shipping"
          @change="selectProvider(provider)"
        >
          <div class="shipping__label">
            {{ provider.name }}
          </div>

          <div class="shipping__description">
            {{ provider.name }}
          </div>
        </SfRadio>

        <abstract-payment-observer v-if="selectedProvider.name">
          <component
            class="py-8"
            @paymentLoading="paymentLoading = arguments[0]"
            @isPaymentReady="isPaymentReady = arguments[0]"
            @providerPaymentHandler="providerPaymentHandler = arguments[0]"
            :cart="cart"
            :provider="selectedProvider"
            :is="getComponentProviderByName(selectedProvider.name)"
          />
        </abstract-payment-observer>

        <SfCheckbox
          v-e2e="'terms'"
          v-model="terms"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to') }} {{ $t('Terms and conditions') }}
            </div>
          </template>
        </SfCheckbox>

        <div class="summary__action">
          <SfButton
            type="button"
            class="sf-button color-secondary summary__back-button"
            @click="$router.push(localePath('/checkout/billing'))"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            v-e2e="'make-an-order'"
            :disabled="loading || !isPaymentReady || !terms"
            class="summary__action-button"
            @click="providerPaymentHandler"
          >
            {{ $t('Make an order') }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfAccordion, SfButton, SfCheckbox, SfDivider, SfHeading, SfIcon, SfImage, SfLink, SfPrice,
  SfProperty, SfRadio, SfTable
} from '@storefront-ui/vue';
import { onSSR } from '@vue-storefront/core';
import { useUiHelpers } from '~/composables';

import { computed, ref, watch, useRoute, useRouter } from '@nuxtjs/composition-api';
import {
  cartGetters,
  orderGetters, useCart, useMakeOrder, usePayment
} from '@vue-storefront/odoo';

export default {
  name: 'Payment',
  components: {
    SfHeading,
    SfTable,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfImage,
    SfIcon,
    SfPrice,
    SfProperty,
    SfAccordion,
    SfLink,
    SfRadio,
    VsfPaymentProvider: () =>
      import('~/components/Checkout/VsfPaymentProvider'),
    AdyenPaymentProvider: () =>
      import('~/components/Checkout/AdyenPaymentProvider'),
    AdyenDirectPaymentProvider: () =>
      import('~/components/Checkout/AdyenDirectPaymentProvider'),
    AdyenExternalPaymentProvider: () =>
      import('~/components/Checkout/AdyenExternalPaymentProvider'),
    WireTransferPaymentProvider: () =>
      import('~/components/Checkout/WireTransferPaymentProvider'),
    AbstractPaymentObserver: () =>
      import('~/components/Checkout/AbstractPaymentObserver')
  },
  setup(props, context) {
    const router = useRouter();
    const { cart, load, setCart } = useCart();
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    if (totalItems.value === 0)
      router.push('/cart');

    const { providerList, getPaymentProviderList } = usePayment();
    const { order, make, loading } = useMakeOrder();
    const th = useUiHelpers();

    const paymentLoading = ref(false);
    const isPaymentReady = ref(false);
    const terms = ref(false);
    const selectedProvider = ref({});

    const selectProvider = (provider) => {
      isPaymentReady.value = false;
      selectedProvider.value = provider;
      context.emit('status');
    };

    onSSR(async () => {
      await load();
      await getPaymentProviderList();
    });

    const processOrder = async () => {
      await make();

      const thankYouPath = {
        name: 'thank-you',
        query: { order: orderGetters.getId(order.value) }
      };
      router.push(thankYouPath);
      setCart(null);
    };

    watch(
      () => totalItems.value,
      () => {
        if (totalItems.value === 0)
          router.push('/cart');
      }
    );

    const providerPaymentHandler = () => {};

    const providerListHasMoreThanOne = computed(
      () => providerList?.value?.length > 1
    );

    return {
      isPaymentReady,
      terms,
      loading,
      products: computed(() => cartGetters.getItems(cart.value)),
      totals: computed(() => cartGetters.getTotals(cart.value)),
      tableHeaders: ['Description', 'Size', 'Color', 'Quantity', 'Amount'],
      cartGetters,
      processOrder,
      providerList,
      selectProvider,
      selectedProvider,
      providerListHasMoreThanOne,
      providerPaymentHandler,
      getComponentProviderByName: th.getComponentProviderByName,
      paymentLoading,
      cart
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.table {
  margin: 0 0 var(--spacer-base) 0;
  &__row {
    justify-content: space-between;
  }
  @include for-desktop {
    &__header {
      text-align: center;
      &:last-child {
        text-align: right;
      }
    }
    &__data {
      text-align: center;
    }
    &__description {
      text-align: left;
      flex: 0 0 12rem;
    }
    &__image {
      --image-width: 5.125rem;
      text-align: left;
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.product-sku {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}
.price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.product-price {
  --price-font-size: var(--font-size--base);
}
.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 0;
  }
  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }
  &__action {
    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
    }
  }
  &__action-button {
    margin: 0;
    width: 100%;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    &--secondary {
      @include for-desktop {
        text-align: right;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 0 0;
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    color: var(--c-white);
    &:hover {
      color: var(--c-white);
    }
  }
  &__property-total {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.property {
  margin: 0 0 var(--spacer-sm) 0;
  &__name {
    color: var(--c-text-muted);
  }
}
.accordion {
  margin: 0 0 var(--spacer-xl) 0;
  &__item {
    display: flex;
    align-items: flex-start;
  }
  &__content {
    flex: 1;
  }
  &__edit {
    flex: unset;
  }
}
.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: var(--font-weight--normal);
  }
}
</style>
