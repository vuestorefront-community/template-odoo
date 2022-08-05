<template>
  <div>
    <LazyHydrate when-idle>
      <LazyCheckoutAppHeader class="mb-10" />
    </LazyHydrate>

    <nuxt :key="$route.fullPath" />

    <Notification />
    <LazyHydrate when-visible>
      <GreenFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import { computed, onMounted, useRoute, useRouter } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { usePartner } from '~/composables';
import { useCart } from '@vue-storefront/odoo';
import LazyHydrate from 'vue-lazy-hydration';
import Notification from '~/components/Notification';

export default {
  name: 'DefaultLayout',
  components: {
    LazyHydrate,
    Notification
  },
  setup () {
    const router = useRouter();
    const route = useRoute();
    const { load, cart } = useCart();
    const { partner } = usePartner();

    const hasPartnerShipping = computed(() =>
      cart.value?.order?.partnerShipping?.id !== null &&
      cart.value?.order?.partnerShipping?.email !== null &&
      cart.value?.order?.partnerShipping?.country !== null &&
      cart.value?.order?.partnerShipping?.name !== null
    );
    const hasPartnerInvoice = computed(() =>
      cart.value?.order?.partnerInvoice?.id !== null &&
      cart.value?.order?.partnerInvoice?.email !== null &&
      cart.value?.order?.partnerInvoice?.country !== null &&
      cart.value?.order?.partnerInvoice?.name !== null
    );

    const partnerIsSaved = computed(() => partner?.value?.name && !partner?.value?.name?.toUpperCase()?.includes('PUBLIC'));

    onSSR(async () => {
      await load({ customQuery: { cartLoad: 'greenCartLoadUpdate' } });
    });

    onMounted(() => {
      if (cart.value?.order?.websiteOrderLine.length === 0) {
        return router.push('/');
      }
      if (!partnerIsSaved.value) {
        return router.push('/checkout/personaldetails');
      }

      if (!hasPartnerShipping.value || !hasPartnerInvoice.value) {
        return router.push('/checkout/shipping');
      }
    });

  }
};
</script>

<style lang="scss">
@import "~/assets/styles.scss";
</style>
