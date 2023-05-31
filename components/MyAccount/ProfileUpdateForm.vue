<template>
  <ValidationObserver v-slot="{ invalid }">
    <form class="form" @submit.prevent="submitForm()">
      <h1 class="mb-8">{{ $t('My profile') }}</h1>

      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:2"
        class="form__element common_form_style"
      >
        <SfInput
          v-model="form.name"
          name="name"
          :label="$t('Name')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|email"
        class="form__element common_form_style"
      >
        <SfInput
          v-model="form.email"
          type="email"
          name="email"
          :label="$t('Your e-mail')"
          required
          :valid="!errors[0]"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <SfModal
        :visible="requirePassword"
        :title="$t('Attention!')"
        cross
        persistent
        @close="requirePassword = false"
      >
        {{
          $t('Please type your current password to change your email address.')
        }}
        <SfInput
          v-model="currentPassword"
          type="password"
          name="currentPassword"
          :label="$t('Current Password')"
          required
          class="form__element"
          style="margin-top: 10px"
          @keypress.enter="submitForm()"
        />
        <OdooButton type="submit" :disabled="invalid" :loading="loading">
          {{ $t('Update personal data') }}
        </OdooButton>
      </SfModal>
      <OdooButton type="submit" :disabled="invalid" :loading="loading">
        {{ $t('Update personal data') }}
      </OdooButton>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { SfInput, SfModal } from '@storefront-ui/vue';
import { userGetters, useUser } from '@vue-storefront/odoo';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { useUiNotification } from '~/composables';
export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfModal,
    ValidationProvider,
    ValidationObserver
  },
  emits: ['submit'],
  setup(_, { root }) {
    const { send } = useUiNotification();
    const { user, updateUser } = useUser();

    const currentPassword = ref('');
    const requirePassword = ref(false);
    const loading = ref(false);

    const resetForm = () => ({
      name: userGetters.getFirstName(user.value) || '',
      email: userGetters.getEmailAddress(user.value) || ''
    });
    const form = ref(resetForm());

    const submitForm = async () => {
      loading.value = true;
      try {
        await updateUser({
          user: {
            ...user,
            name: form.value.name,
            email: form.value.email
          }
        });

        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
        send({
          message: root.$t('Successfull update!'),
          type: 'success'
        });
      } catch (e) {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';

        send({ message: e?.value, type: 'danger' });
      }

      loading.value = false;
    };

    return {
      loading,
      submitForm,
      user,
      requirePassword,
      currentPassword,
      form
    };
  }
});
</script>
<style lang="scss" scoped>
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
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
