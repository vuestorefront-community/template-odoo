<template>
  <ValidationObserver v-slot="{ handleSubmit, invalid }">
    <form class="form" @submit.prevent="handleSubmit(submitForm)">
      <h1 class="mb-5">{{ $t('Update password') }}</h1>

      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="form__element common_form_style"
      >
        <SfInput
          v-model="form.currentPassword"
          type="password"
          name="currentPassword"
          :label="$t('Current Password')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        vid="password"
        class="form__element common_form_style"
      >
        <SfInput
          v-model="form.newPassword"
          type="password"
          name="newPassword"
          :label="$t('New Password')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|confirmed:password"
        class="form__element common_form_style"
      >
        <SfInput
          v-model="form.repeatPassword"
          type="password"
          name="repeatPassword"
          :label="$t('Repeat Password')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <OdooButton
        type="submit"
        :disabled="invalid || loading"
        :loading="loading"
      >
        {{ $t("Update password") }}
      </OdooButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { usePassword } from '@vue-storefront/odoo';
import { useUiNotification } from '~/composables';
export default {
  name: 'PasswordResetForm',
  components: {
    SfInput,
    SfButton,
    ValidationProvider,
    ValidationObserver
  },
  setup(_, { root }) {
    const { updatePassword, loading, errors } = usePassword();
    const { send } = useUiNotification();

    const resetForm = () => ({
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    });
    const form = ref(resetForm());

    const submitForm = async () => {
      await updatePassword(form.value.currentPassword, form.value.newPassword);

      if (errors.value) {
        return send({
          message: errors.value?.[0].message || 'Something wrong!',
          type: 'danger'
        });
      }

      form.value = resetForm();

      send({
        message: root.$t('Successfull update!'),
        type: 'success'
      });
    };
    return {
      form,
      submitForm,
      loading
    };
  }
};
</script>

<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
