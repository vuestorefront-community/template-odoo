<template>
  <ValidationObserver
    v-slot="{ handleSubmit, invalid }"
    tag="div"
    class="w-full"
  >
    <form @submit.prevent="handleSubmit(submitForm)">
      
        <ValidationProvider
          v-slot="{ errors }"
          name="firstName"
          rules="required|min:2"
          slim
        >
          <SfInput
            class="form__element common_form_style"
            v-model="form.name"
            :label="$t('First name')"
            name="firstName"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      

      
        <ValidationProvider
          v-slot="{ errors }"
          name="streetName"
          rules="required|min:2"
          slim
        >
          <SfInput
            class="form__element common_form_style"
            v-model="form.street"
            :label="$t('Street name')"
            name="streetName"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="city"
          rules="required|min:2"
          slim
        >
          <SfInput
            v-model="form.city"
            :label="$t('City')"
            name="city"
            class="form__element common_form_style"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
     

      
        <ValidationProvider
          v-slot="{ errors }"
          name="zipCode"
          rules="required|min:2"
          slim
        >
          <SfInput
            v-model="form.zip"
            :label="$t('Zip-code')"
            name="zipCode"
            class="form__element common_form_style"
            :class="{
              'basis-1/3': countryStates.length > 0,
              'basis-1/2': countryStates.length === 0,
            }"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          class="basis-1"
          v-slot="{ errors }"
          name="country"
          rules="required"
          slim
        >
          <SfSelect
            v-model="form.country.id"
            :label="$t('Country')"
            name="country"
            class="form__element sf-select--underlined common_form_style"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
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
          v-if="countryStates.length > 0"
          v-slot="{ errors }"
          name="state"
          rules="required"
          slim
        >
          <SfSelect
            v-model="form.state.id"
            :label="$t('State/Province')"
            name="state"
            class="form__element sf-select--underlined common_form_style"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
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
        v-slot="{ errors }"
        name="phone"
        rules="required|digits:9"
        slim
      >
        <SfInput
          v-model="form.phone"
          :label="$t('Phone number')"
          name="phone"
          class="form__element common_form_style"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <div class="flex flex-row gap-3 mt-10">
        <OdooButton
          type="submit"
          :disabled="invalid || loading"
          :loading="loading"
        >
          {{ $t(isNew ? 'Add the address' : 'Update the address') }}
        </OdooButton>

        <SfButton @click="$emit('cancel')" class="color-light sf-button">
          {{ $t('Cancel') }}
        </SfButton>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { SfInput, SfButton, SfSelect, SfCheckbox } from '@storefront-ui/vue';
import { useCountrySearch, useShipping } from '@vue-storefront/odoo';
import { useUiNotification } from '~/composables';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  reactive,
  watch,
  defineComponent,
  onMounted
} from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'AddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    address: {
      type: Object,
      default: {}
    },
    isNew: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const { search, searchCountryStates, countries, countryStates } =
      useCountrySearch('my-account-shipping');
    const { save, loading } = useShipping();
    const { send } = useUiNotification();

    const form = reactive({
      name: props.address.name,
      street: props.address.street,
      city: props.address.city,
      state: { id: String(props.address?.state?.id) || ' ' },
      country: { id: String(props.address?.country?.id) || ' ' },
      zip: props.address.zip,
      phone: props.address.phone,
      ...(props.isNew ? {} : { id: props.address.id })
    });

    const submitForm = async () => {
      try {
        await save({
          params: {
            ...form,
            countryId: Number(form.country.id),
            stateId: Number(form.state.id)
          }
        });

        emit('save');
      } catch (error) {
        send({ message: 'Some error', type: 'danger' });
      }
    };

    onMounted(async () => {
      await search();
      if (form?.country?.id && form.country.id !== 'null') {
        await searchCountryStates(form.country.id);
      }
    });

    watch(
      () => form.country.id,
      async () => {
        await searchCountryStates(form.country.id);
        if (!countryStates.value || countryStates.value.length === 0) {
          form.state.id = null;
        }
      }
    );

    return {
      loading,
      form,
      submitForm,
      countries,
      countryStates
    };
  }
});
</script>
