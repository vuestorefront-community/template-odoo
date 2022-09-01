<template>
  <div>
    <SfLoader :class="{ loader: loading }" :loading="loading" />
    <div id="dropin-container" ref="dropinDivElement" />
  </div>
</template>

<script>
/* eslint-disable camelcase */

import { ref, onMounted, useRouter } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';
import { SfLoader } from '@storefront-ui/vue';
import { usePayment, useAdyenDirectPayment } from '@vue-storefront/odoo';
import '@adyen/adyen-web/dist/adyen.css';
export default {
  name: 'AdyenDirectPaymentProvider',
  components: {
    SfLoader
  },
  props: {
    provider: {
      required: true,
      type: Object
    },
    cart: {
      required: true,
      type: Object
    }
  },
  onDestroyed() {
    this.adyenDropin.unmount();
    this.adyenDropin = null;
  },
  emits: ['isPaymentReady', 'providerPaymentHandler', 'paymentLoading'],
  setup(props, { emit, root }) {
    const adyenDropin = ref(null);
    const router = useRouter();
    const dropinDivElement = ref(null);
    const loading = ref(false);
    const loadingMakePayment = ref(false);
    const { send } = useUiNotification();
    const { getPaymentConfirmation } = usePayment('');

    const {
      openAdyenTransaction,
      getAdyenAcquirerInfo,
      getAdyenPaymentMethods,
      getAdyenPaymentDetails,
      paymentMethods,
      acquirerInfo,
      adyenMakeDirectPayment,
      transaction
    } = useAdyenDirectPayment(props.provider.id, props.cart?.order?.id);

    onMounted(async () => {
      const AdyenCheckout = require('@adyen/adyen-web');

      loading.value = true;
      await openAdyenTransaction();
      await getAdyenAcquirerInfo();
      await getAdyenPaymentMethods();

      const configuration = {
        locale: root.$config.nodeLocale,
        environment: acquirerInfo.value.state === 'test' ? 'test' : 'live',
        clientKey: acquirerInfo.value.client_key,
        paymentMethodsResponse: paymentMethods.value,
        analytics: {
          enabled: false
        },
        onPaymentCompleted: (result, component) => {
          router.push({ name: 'paymentResponse' });
        },
        onError: (error, component) => {
          if (
            error.errorText !== 'error was cleared' &&
            error.errorText !== 'incomplete field'
          ) {
            send({
              message: error?.message || error?.errorI18n || error?.errorText,
              type: 'danger'
            });
          }

          emit('paymentLoading', false);
        },
        onAdditionalDetails: (state, dropin) => {
          // console.log(state);
          // await getAdyenPaymentDetails({
          //   acquirerId: props.provider.id,
          //   reference: transaction.value.reference,
          //   details: state.data
          // });
        },
        onChange: (state, component) => {
          if (component.isValid) {
            emit('isPaymentReady', true);
            return;
          }
          emit('isPaymentReady', false);
        },

        onSubmit: async (state, dropin) => {
          emit('isPaymentReady', false);
          emit('paymentLoading', true);
          const response = await adyenMakeDirectPayment({
            acquirerId: props.provider.id,
            reference: transaction.value.reference,
            paymentMethod: state.data.paymentMethod,
            token: transaction.value.access_token,
            browserInfo: state.data?.browserInfo || {}
          });

          if (response.action?.type) {
            adyenDropin.value.handleAction(response.action);
            emit('paymentLoading', false);
            return;
          }

          const data = await getPaymentConfirmation({
            customQuery: { paymentConfirmation: 'greenConfirmationPayment' }
          });
          const paymentSuccess =
            data?.order?.lastTransaction?.state === 'Authorized' ||
            data.order?.lastTransaction?.state === 'Confirmed';

          emit('paymentLoading', false);
          if (paymentSuccess) {
            router.push({ name: 'successPaymentResponse' });
            return;
          }

          router.push({ name: 'failedPaymentResponse' });
        }
      };

      const checkout = new AdyenCheckout(configuration);

      adyenDropin.value = checkout
        .create('dropin', {
          openFirstPaymentMethod: true,
          openFirstStoredPaymentMethod: false,
          showStoredPaymentMethods: false,
          showPaymentMethods: true,
          showPayButton: false,
          setStatusAutomatically: true,
          onSelect: (component) => {
            if (component.isValid) {
              emit('isPaymentReady', true);
              return;
            }
            emit('isPaymentReady', false);
          }
        })
        .mount('#dropin-container');

      loading.value = false;

      emit('providerPaymentHandler', adyenDropin.value.submit);
    });

    return {
      loading,
      dropinDivElement,
      adyenDropin,
      acquirerInfo
    };
  }
};
</script>

<style lang="scss" scoped>
.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}
</style>
