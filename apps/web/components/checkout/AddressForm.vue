<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <!-- <SfButton v-if="savedAddress" size="sm" variant="tertiary" @click="open">
        {{ $t('contactInfo.edit') }}
      </SfButton> -->
    </div>

    <!-- <div v-if="savedAddress" class="mt-2 md:w-[520px]">
      <p>{{ `${savedAddress.firstName} ${savedAddress.lastName}` }}</p>
      <p>{{ savedAddress.phoneNumber }}</p>
      <p>{{ `${savedAddress.address1} ${savedAddress.address2}` }}</p>
      <p>{{ `${savedAddress.state}, ${savedAddress.postalCode}` }}</p>
    </div> -->

    <div class="w-full md:max-w-[520px]">
      <p>{{ description }}</p>
      <SfButton class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ buttonText }}
      </SfButton>
    </div>

    <SfModal
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit z-50"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="close"
        >
          <SfIconClose />
        </SfButton>
        <h3
          id="address-modal-title"
          class="text-neutral-900 text-lg md:text-2xl font-bold mb-4"
        >
          {{ heading }}
        </h3>
      </header>
      <FormAddAddress
        :saved-address="savedAddress"
        :type="type"
        @on-save="close"
        @on-close="close"
      />
    </SfModal>
  </div>
</template>
<script lang="ts" setup>
import {
  SfButton,
  SfIconClose,
  useDisclosure,
  SfModal,
} from '@storefront-ui/vue';

defineProps({
  heading: String,
  description: String,
  buttonText: String,
  type: String,
  savedAddress: {
    type: Object,
    required: true,
  },
});

const { isOpen, open, close } = useDisclosure();
</script>
