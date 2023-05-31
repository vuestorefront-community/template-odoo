<template>
  <ValidationObserver v-slot="{ handleSubmit, invalid }" ref="formRef">
    <SfHeading
      :level="3"
      :title="$t('Billing')"
      class="sf-heading--left sf-heading--no-underline title mt-10 mb-6"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <SfCheckbox
          :selected="sameAsShipping"
          :label="$t('Copy address data from shipping')"
          name="copyShippingAddress"
          class="form__element"
          @change="handleCheckSameAddress"
        />
        <ValidationProvider
          name="firstName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.name"
            :label="$t('First name')"
            name="firstName"
            class="form__element common_form_style"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="streetName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.street"
            :label="$t('Street name')"
            name="streetName"
            class="form__element common_form_style"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="city"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.city"
            :label="$t('City')"
            name="city"
            class="form__element form__element--half common_form_style"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="zipCode"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.zip"
            :label="$t('Zip-code')"
            name="zipCode"
            class="form__element form__element--half form__element--half-even common_form_style"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-model="form.country.id"
            :label="$t('Country')"
            name="country"
            class="
              form__element form__select
              sf-select--underlined common_form_style
            "
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryOption in countries"
              :key="countryOption.id"
              :value="countryOption.id"
            >
              {{ countryOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>

        <ValidationProvider
          name="state"
          rules="required"
          v-slot="{ errors, validate }"
          slim
        >
          <SfSelect
            v-model="form.state.id"
            :label="$t('State/Province')"
            name="state"
            class="
              form__element form__select
              sf-select--underlined
              common_form_style
            "
            :class="[
              countryStates && countryStates.length ? 'd-block' : 'hidden',
            ]"
            required
            @change="validate"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryStateOption in countryStates"
              :key="countryStateOption && countryStateOption.id"
              :value="countryStateOption && countryStateOption.id"
            >
              {{ countryStateOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>

        <ValidationProvider
          name="phone"
          rules="required|digits:9"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.phone"
            :label="$t('Phone number')"
            name="phone"
            class="form__element common_form_style"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            class="sf-button--full-width mt-4"
            type="submit"
          >
            {{ $t('Continue to payment') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio,
  SfCheckbox
} from '@storefront-ui/vue';
import { ref, onMounted, watch, computed } from '@nuxtjs/composition-api';
import {
  useBilling,
  useCountrySearch,
  useShippingAsBillingAddress,
  useCart,
  cartGetters
} from '@vue-storefront/odoo';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';

export default {
  name: 'Billing',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  setup(props, { root }) {
    const { load: loadCart } = useCart();

    const { search, searchCountryStates, countries, countryStates } = useCountrySearch();
    const { load: loadBillingAddress, billing, save, error } = useBilling();

    const { use } = useShippingAsBillingAddress();

    const isFormSubmitted = ref(false);
    const sameAsShipping = ref(false);
    const formRef = ref(false);

    const form = ref({
      name: '',
      street: '',
      city: '',
      state: { id: null },
      country: { id: null },
      zip: '',
      phone: null
    });

    const handleCheckSameAddress = async () => {
      sameAsShipping.value = !sameAsShipping.value;
      if (sameAsShipping.value) {
        const shippingAddress = await use();

        form.value = shippingAddress;

        await searchCountryStates(form.value?.country?.id);
      }
    };

    const handleFormSubmit = async () => {
      await save({
        params: {
          ...form.value,
          stateId: parseInt(form.value.state.id),
          countryId: parseInt(form.value?.country?.id)
        }
      });
      isFormSubmitted.value = true;

      if (!error.save) {
        root.$router.push(root.localePath('/checkout/payment'));
      }
    };

    const loadPreviousData = async() => {
      if (billing.value.name === 'Public user') {
        return;
      }

      const { name, street, city, state, country, zip, phone, id } = billing.value;
      form.value.id = id;
      form.value.name = name;
      form.value.street = street;
      form.value.city = city;
      form.value.state = state.id !== 'undefined' ? state : { id: '' },
      form.value.country = country.id !== 'undefined' ? country : { id: '' },
      form.value.zip = zip;
      form.value.phone = phone;
      form.value.selectedMethodShipping = id;
    };

    onMounted(async () => {
      await loadCart();
      await loadBillingAddress();
      await search();
      await loadPreviousData();
    });

    watch(
      () => form?.value?.country.id,
      async () => {
        await searchCountryStates(form?.value?.country?.id || null);
        if (!countryStates.value || countryStates.value.length === 0) {
          form.value.state.id = null;
        } else {
          form.value.state.id = String(countryStates.value?.[0]?.id);
        }
      }
    );

    return {
      error,
      formRef,
      countries,
      countryStates,
      handleCheckSameAddress,
      sameAsShipping,
      form,
      handleFormSubmit
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
</style>
