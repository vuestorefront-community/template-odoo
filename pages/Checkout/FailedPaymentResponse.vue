<template>
  <div class="p-20 py-40">
    <SfLoader :class="{ loader: loading }" :loading="loading" />
    <div class="flex justify-center flex-col items-center">
      <SfHeading
        :title="$t('There was an error!')"
        :level="2"
        class="mb-10"
      />

      <SfHeading
        title="Unfortunately, an error occurred with your payment and your order could not be completed"
        :level="4"
      />
      <SfHeading
        title="We have saved your basket so you can try the payment again"
        :level="4"
      />

      <nuxt-link to="/checkout/payment">
        Try the payment again
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
declare let Clerk: any;

import { defineComponent, onMounted, ref, Ref } from '@nuxtjs/composition-api';
import { SfHeading, SfLoader, usePayment } from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default defineComponent({
  components: {
    SfHeading,
    SfLoader
  },
  emits: ['changeStep'],
  setup(props, { root, emit }) {
    emit('changeStep', 4);

    return {
      loading: false
    };
  }
});
</script>
<style lang="scss" scoped>
::v-deep .sf-heading__title.h4 {
  font-weight: 300;
}
</style>
