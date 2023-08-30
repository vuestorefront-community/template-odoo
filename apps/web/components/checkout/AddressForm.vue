<script lang="ts" setup>
import {
  SfButton,
  SfIconClose,
  useDisclosure,
  SfModal,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
  SfSelect,
} from '@storefront-ui/vue';

const props = defineProps({
  heading: String,
  description: String,
  buttonText: String,
  type: String,
  savedAddress: {
    type: Object,
    required: true,
  },
});

const { savedAddress }: any = toRefs(props);
const { isOpen, open, close } = useDisclosure();

const isCartUpdateLoading = false;
const defaultValues = ref({
  name: savedAddress?.name ?? '',
  streetName: savedAddress?.value?.streetName ?? '',
  phone: savedAddress?.value?.phoneNumber ?? '',
  country: savedAddress?.value?.country ?? '',
  city: savedAddress?.value?.city ?? '',
  state: savedAddress?.value?.state ?? '',
  postalCode: savedAddress?.value?.postalCode ?? '',
});
const countries = ['US'];
const states = ['California'];
</script>

<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ props.heading }}
      </h2>
      <SfButton v-if="savedAddress" size="sm" variant="tertiary" @click="open">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>

    <!-- <div v-if="savedAddress" class="mt-2 md:w-[520px]">
      <p>{{ `${savedAddress.name} ${savedAddress.streetName}` }}</p>
      <p>{{ savedAddress.phoneNumber }}</p>
      <p>{{ `${savedAddress.address1} ${savedAddress.address2}` }}</p>
      <p>{{ `${savedAddress.state}, ${savedAddress.postalCode}` }}</p>
    </div> -->

    <div class="w-full md:max-w-[520px]">
      <p>{{ props.description }}</p>
      <SfButton class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ props.buttonText }}
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
      <form
        class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
        data-testid="address-form"
        @submit.prevent="close"
      >
        <label>
          <FormLabel>{{ $t('form.NameLabel') }}</FormLabel>
          <SfInput
            name="name"
            autocomplete="given-name"
            v-model="defaultValues.name"
            required
          />
        </label>
        <label class="md:col-span-2">
          <FormLabel>{{ $t('form.streetNameLabel') }}</FormLabel>
          <SfInput
            name="streetName"
            autocomplete="family-name"
            v-model="defaultValues.streetName"
            required
          />
        </label>
        <label class="md:col-span-3">
          <FormLabel>{{ $t('form.phoneLabel') }}</FormLabel>
          <SfInput
            name="phone"
            type="tel"
            autocomplete="tel"
            v-model="defaultValues.phone"
            required
          />
        </label>
        <label class="md:col-span-3">
          <FormLabel>{{ $t('form.countryLabel') }}</FormLabel>
          <SfSelect
            v-model="defaultValues.country"
            name="country"
            :placeholder="$t('form.selectPlaceholder')"
            autocomplete="country-name"
            required
          >
            <option v-for="country in countries" :key="country">
              {{ country }}
            </option>
          </SfSelect>
        </label>
        <label class="md:col-span-3">
          <FormLabel>{{ $t('form.stateLabel') }}</FormLabel>
          <SfSelect
            v-model="defaultValues.state"
            name="state"
            :placeholder="$t('form.selectPlaceholder')"
            autocomplete="state-name"
            required
          >
            <option v-for="state in states" :key="state">{{ state }}</option>
          </SfSelect>
        </label>

        <label class="md:col-span-2">
          <FormLabel>{{ $t('form.cityLabel') }}</FormLabel>
          <SfInput
            name="city"
            autocomplete="address-level2"
            v-model="defaultValues.city"
            required
          />
        </label>
        <label>
          <FormLabel>{{ $t('form.postalCodeLabel') }}</FormLabel>
          <SfInput
            name="postalCode"
            autocomplete="postal-code"
            v-model="defaultValues.postalCode"
            required
          />
        </label>

        <label
          v-if="props.type === 'billingAddress'"
          class="md:col-span-3 flex items-center gap-2"
        >
          <SfCheckbox name="useAsShipping" />
          {{ $t('form.useAsShippingLabel') }}
        </label>

        <div
          class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4"
        >
          <SfButton type="reset" class="" variant="secondary" @click="close">
            {{ $t('contactInfo.cancel') }}
          </SfButton>
          <SfButton
            type="submit"
            class="min-w-[120px]"
            :disabled="isCartUpdateLoading"
          >
            <SfLoaderCircular
              v-if="isCartUpdateLoading"
              class="flex justify-center items-center"
              size="sm"
            />
            <span v-else>
              {{ $t('contactInfo.save') }}
            </span>
          </SfButton>
        </div>
      </form>
    </SfModal>
  </div>
</template>
