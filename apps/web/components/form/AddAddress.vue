<script lang="ts" setup>
import {
  SfButton,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
  SfSelect,
} from '@storefront-ui/vue';

const isCartUpdateLoading = false;

const props = defineProps({
  savedAddress: {
    type: Object,
    required: true,
  },
  type: {
    type: [String],
    required: true,
  },
});

const { savedAddress } = toRefs(props);

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
defineEmits(['on-save', 'on-close']);
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="address-form"
    @submit.prevent="$emit('on-close')"
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
      <SfButton
        type="reset"
        class=""
        variant="secondary"
        @click="$emit('on-close')"
      >
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
</template>
