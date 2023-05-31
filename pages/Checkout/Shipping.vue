<template>
  <ValidationObserver v-slot="{ handleSubmit, invalid }" ref="formRef">
    <SfHeading
      :level="3"
      :title="$t('Shipping Details')"
      class="sf-heading--left sf-heading--no-underline title mt-10 mb-5"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <UserShippingAddresses
        v-if="isAuthenticated && hasSavedShippingAddress"
        v-model="defaultShippingAddress"
        :current-address-id="currentAddressId || ''"
        @setCurrentAddress="handleSetCurrentAddress"
      />
      <div class="form" v-if="canAddNewAddress">
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
              form__element sf-select--underlined common_form_style
            "
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryOption in countries"
              :key="countryOption && countryOption.id"
              :value="countryOption && countryOption.id"
            >
              {{ countryOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>

        <ValidationProvider
          name="state"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-model="form.state.id"
            :label="$t('State/Province')"
            name="state"
            class="
              form__element sf-select--underlined
              common_form_style
            "
            :class="[
              countryStates && countryStates.length ? 'd-block' : 'hidden',
            ]"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
           <SfSelectOption
              v-for="countryStateOption in countryStates"
              :key="countryStateOption.id"
              :value="countryStateOption.id"
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
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <SfButton
        v-if="!canAddNewAddress"
        class="color-light form__action-button form__action-button--add-address"
        type="button"
        @click.native="handleAddNewAddressBtnClick"
      >
        {{ $t("Add new address") }}
      </SfButton>

      <SfHeading
        :level="3"
        :title="$t('Select shipping method')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <VsfShippingProvider
        name="selectedMethodShipping"
        :selectedMethodShipping="form.selectedMethodShipping"
        @submit="$router.push(localePath('/checkout/billing'))"
        @selectedMethod="handleSelectedMethodShipping"
      />
      <SfButton
        @click="formFieldAutoFocusSet"
        type="submit"
        class="sf-button--full-width mt-4"
      >
        {{ $t("Continue to billing") }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { SfHeading, SfInput, SfButton, SfSelect } from '@storefront-ui/vue';
import { ref, watch, onMounted, computed } from '@nuxtjs/composition-api';
import {
  useCountrySearch,
  useUser,
  userShippingGetters,
  useShipping,
  useCart,
  cartGetters,
  useUserShipping
} from '@vue-storefront/odoo';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
export default {
  name: 'Shipping',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    ValidationProvider,
    ValidationObserver,
    UserShippingAddresses: () =>
      import('~/components/Checkout/UserShippingAddresses.vue'),
    VsfShippingProvider: () =>
      import('~/components/Checkout/VsfShippingProvider')
  },
  setup(props, { root, emit }) {
    const isFormSubmitted = ref(false);
    const formRef = ref(false);
    const currentAddressId = ref('');
    const defaultShippingAddress = ref(false);
    const isShippingDetailsStepCompleted = ref(false);
    const canAddNewAddress = ref(true);
    const { load: loadCart } = useCart();

    const { load: loadShippingAddress, shipping, save } = useShipping();

    const { isAuthenticated } = useUser();

    const { search, searchCountryStates, countries, countryStates } =
      useCountrySearch();

    const form = ref({
      name: '',
      street: '',
      city: '',
      state: { id: ' ' },
      country: { id: ' ' },
      zip: '',
      phone: null,
      selectedMethodShipping: null
    });

    const handleFormSubmit = async () => {
      await save({
        params: {
          ...form.value,
          stateId: parseInt(form.value.state.id),
          countryId: parseInt(form.value?.country?.id)
        }
      });
      isFormSubmitted.value = true;

      if (root.$router.history.current.path !== '/my-account/shipping-details')
        root.$router.push(root.localePath('/checkout/billing'));
      else root.$router.push(root.localePath('/my-account/shipping-details'));

      emit("finish", true);
    };

    const formFieldAutoFocusSet = () => {
      formRef.value.validate().then((isValid) => {
        setTimeout(() => {
          const errors = formRef.value.errors;
          const errorFields = [];
          for (const [key, value] of Object.entries(errors)) {
            if (value[0]) {
              errorFields.push(key);
            }
          }
          const [first] = errorFields;
          if (!isValid) {
            const el = document.querySelector(`input[name=${first}]`);
            if (el) {
              el.focus();
            } else {
              document.querySelector(`select[name=${first}]`).focus();
            }
          }
        }, 100);
      });
    };

    const hasSavedShippingAddress = computed(() => {
      if (!isAuthenticated.value || !shipping.value) {
        return false;
      }

      const addresses = userShippingGetters.getAddresses(shipping.value);
      return Boolean(addresses?.length);
    });

    const handleAddNewAddressBtnClick = () => {
      currentAddressId.value = '';
      form.value = {};
      canAddNewAddress.value = true;
      isShippingDetailsStepCompleted.value = false;
    };

    const handleSetCurrentAddress = (addr) => {
      form.value = addr;
      currentAddressId.value = addr?.id;
      canAddNewAddress.value = false;
      isShippingDetailsStepCompleted.value = false;
    };

    const handleSelectedMethodShipping = (method) => {
      form.value.selectedMethodShipping = method;
    };

    const setPreviousShippingData = async() => {
      if (shipping.value) {
        if (shipping.value.name === 'Public user') {
          return;
        }
        const { name, street, city, state, country, zip, phone, id } = shipping.value;
        form.value.id = id;
        form.value.name = name;
        form.value.street = street;
        form.value.city = city;
        form.value.state = state.id !== 'undefined' ? state : { id: ' ' },
        form.value.country = country.id !== 'undefined' ? country : { id: ' ' },
        form.value.zip = zip;
        form.value.phone = phone;
        form.value.selectedMethodShipping = null;
      }
    };

    onMounted(async () => {
      await loadCart();
      await search();
      await loadShippingAddress();
      await setPreviousShippingData();
      formRef.value.validate({ silent: true });
    });

    watch(
      () => form.value?.country?.id,
      async () => {
        await searchCountryStates(form.value?.country?.id);
        if (!countryStates.value || countryStates.value.length === 0) {
          form.value.state.id = null;
        } else {
          form.value.state.id = ' ';
        }
      }
    );

    return {
      formRef,
      handleSelectedMethodShipping,
      isShippingDetailsStepCompleted,
      canAddNewAddress,
      handleAddNewAddressBtnClick,
      defaultShippingAddress,
      handleSetCurrentAddress,
      currentAddressId,
      shipping,
      hasSavedShippingAddress,
      isAuthenticated,
      isFormSubmitted,
      form,
      countries,
      countryStates,
      handleFormSubmit,
      formFieldAutoFocusSet,
    };
  }
};
</script>

