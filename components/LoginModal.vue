<template>
  <SfModal :visible="isLoginModalOpen" class="modal" @close="toggleLoginModal">
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="isLogin ? $t('Log in') : $t('Sign in')"
        @click:close="toggleLoginModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="isLogin">
        <div v-show="isForgottenPassword">
          <p class="sign-title">{{ $t('Reset your password') }}.</p>
          <p class="reset-pass-text">
            {{
              $t(
                'Enter the mobile number or email address associated with your account, and we will send you a link to reset your password.',
              )
            }}
          </p>
        </div>
        <div v-show="!isForgottenPassword">
          <p class="sign-title">{{ $t('Log into your account') }}</p>
          <p class="reset-pass-text">
            {{
              $t(
                'View orders and update your details. Make your checkout fast and easy!',
              )
            }}
          </p>
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" 
         key="log-in"
         >
          <form
            class="form"
            @submit.prevent="
              handleSubmit(
                isForgottenPassword ? handlePasswordRecovery : handleLogin,
              )
            "
          >
            <ValidationProvider rules="required|email" 
             v-slot="{ errors }"
             class="form__element common_form_style mb-3"
             >
              <SfInput
                data-cy="login-input_email"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Your email address')"
                class="form__element"
              />
            </ValidationProvider>
            <template v-if="!isForgottenPassword">
              <ValidationProvider rules="required"
               class="form__element common_form_style mb-3" 
               v-slot="{ errors }">
                <SfInput
                  data-cy="login-input_password"
                  v-model="form.password"
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                  name="password"
                  :icon="{ icon: 'show_password' }"
                  type:icon="text"
                  :label="$t('Your password')"
                  @click:icon="
                    {
                      showPassword = !showPassword;
                    }
                  "
                  :type="showPassword ? 'text' : 'password'"
                  class="form__element"
                />
              </ValidationProvider>
              <div class="action">
                <SfCheckbox
                  data-cy="login-checkbox-remember-me"
                  v-model="rememberMe"
                  name="remember-me"
                  :label="$t('Remember me')"
                  class="form__element checkbox"
                />
                <SfButton
                  data-cy="login-btn_forgot-password"
                  class="sf-button--text"
                  @click="isForgottenPassword = !isForgottenPassword"
                >
                  {{
                    isForgottenPassword
                      ? $t('log in into your account')
                      : $t('I forgot my password?')
                  }}
                </SfButton>
              </div>
            </template>

            <SfButton
              data-cy="login-btn_submit"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>
                  {{
                    isForgottenPassword
                      ? $t('Reset password')
                      : $t('log in into your account')
                  }}
                </div>
              </SfLoader>
            </SfButton>
            <SfButton
              data-cy="login-btn_submit"
              class="sf-button--full-width sf-button--outline sf-button--se form__button mt-4"
              @click="displayChoosedTrue(() => (isCreateAccount = true))"
            >
              <div>
                {{ $t('Create new account') }}
              </div>
            </SfButton>
          </form>
        </ValidationObserver>

        <div class="bottom" v-show="!isForgottenPassword">
          <p class="bottom-enjoy">{{ $t('Enjoy these perks with your free account') }}!</p>
          <div class="block lg:flex justify-around">
            <div class="flex additional-account">
              <SfIcon
                icon="clock"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Faster checkout') }}</p>
            </div>
            <div class="flex additional-account">
              <SfIcon
                icon="heart"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Manage your wishlist') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form
            class="form"
            @submit.prevent="handleSubmit(handleRegister)"
            autocomplete="off"
          >
            <div>
              <p class="sign-title">{{ $t('Create your new account') }}!</p>
              <p class="reset-pass-text">
                {{
                  $t(
                    'Find your favorite products and brands. Add favorites and make your checkout fast and easy!',
                  )
                }}
              </p>
            </div>
            <ValidationProvider rules="required" v-slot="{ errors }" 
              class="form__element common_form_style mb-3">
              <SfInput
                data-cy="login-input_name"
                v-model="form.name"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="name"
                :label="$t('Your name')"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|email" v-slot="{ errors }" 
             class="form__element common_form_style mb-3">
              <SfInput
                data-cy="login-input_email"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="Your email address"
                :label="$t('Your email address')"
              />
            </ValidationProvider>

            <ValidationProvider rules="required" v-slot="{ errors }"
             class="form__element common_form_style mb-3">
              <SfInput
                data-cy="login-input_password"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                :label="$t('Your password')"
                :icon="{ icon: 'show_password' }"
                @click:icon="
                  {
                    showPassword = !showPassword;
                  }
                "
                :type="showPassword ? 'text' : 'password'"
              />
            </ValidationProvider>
            <ValidationProvider
              :rules="{ required: { allowFalse: false } }"
              v-slot="{ errors }"
              class="flex items-center gap-2 mb-6"
            >
                <SfCheckbox
                  v-model="createAccount"
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                  :label="$t('I agree with Privacy Policy and Terms of use.')"
                  name="create-account"
                />
            </ValidationProvider>

            <SfButton
              data-cy="login-btn_submit"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Create new account') }}</div>
              </SfLoader>
            </SfButton>
            <SfButton
              data-cy="login-btn_submit"
              class="sf-button--full-width sf-button--outline sf-button--se form__button mt-4"
              @click="displayChoosedTrue(() => (isLogin = true))"
            >
              <div>
                {{ $t('login in to your account') }}
              </div>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="bottom">
          <p class="bottom-enjoy">{{ $t('Enjoy these perks with your free account') }}!</p>
          <div class="block lg:flex justify-around">
            <div class="flex additional-account">
              <SfIcon
                icon="clock"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Faster checkout') }}</p>
            </div>
            <div class="flex additional-account">
              <SfIcon
                icon="heart"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Manage your wishlist') }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </SfModal>
</template>
<script>
import { ref, watch } from '@nuxtjs/composition-api';
import { useUiNotification } from '~/composables';

import {
  SfModal,
  SfInput,
  SfIcon,
  SfButton,
  SfCheckbox,
  SfLoader,
  SfAlert,
  SfBar
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useUser, usePassword } from '@vue-storefront/odoo';
import { useUiState } from '~/composables';

export default {
  name: 'LoginModal',
  components: {
    SfModal,
    SfInput,
    SfIcon,
    SfButton,
    SfCheckbox,
    SfLoader,
    SfAlert,
    ValidationProvider,
    ValidationObserver,
    SfBar
  },
  setup() {
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const { send } = useUiNotification();
    const form = ref({});

    const showPassword = ref(false);
    const isLogin = ref(true);
    const isForgottenPassword = ref(false);
    const isCreateAccount = ref(true);

    const createAccount = ref(false);
    const rememberMe = ref(false);
    const { register, login, logout, loading, error, user } = useUser();
    const {
      sendResetPassword,
      errors: errorPassword,
      resetPasswordErrors
    } = usePassword();

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetPasswordErrors();
      }
    });

    const handleForm = (fn, params, customQuery) => async () => {
      await fn({ user: params, customQuery });

      if (error.value.login) {
        send({ message: error?.value?.login?.message, type: 'danger' });
        return;
      }
      if (error.value.register) {
        send({ message: error?.value?.register?.message, type: 'danger' });
        return;
      }
      if (isForgottenPassword.value) {
        send({
          message: `Thanks! If there is an account registered with the ${form.value.email} email, you will find message with a password reset link in your inbox. If the message is not arriving in your inbox, try another email address you might’ve used to register.`,
          type: 'info'
        });
      }

      if (user.value !== undefined) {
        toggleLoginModal();
      }
    };

    const displayChoosedTrue = async (fn) => {
      isLogin.value = false;
      isForgottenPassword.value = false;
      isCreateAccount.value = false;
      fn();
    };

    const showIsForgottenPassword = () => {
      isForgottenPassword.value = true;
      isLogin.value = true;
    };

    const handleRegister = async () => {
      await handleForm(register, form.value)()
      await logout()
      displayChoosedTrue(() => (isLogin.value = true))
      toggleLoginModal();
    };

    const handleLogin = async () => {
      await handleForm(login, {
        username: form.value.email,
        password: form.value.password
      })();

      if (!error.value.login) {
        send({
          message: 'You are logged in. Welcome!',
          type: 'success'
        });
      }

    };

    const handlePasswordRecovery = async () =>
      handleForm(sendResetPassword, {
        email: form.value.email
      })();

    return {
      form,
      showPassword,
      loading,
      errorPassword,
      isLogin,
      error,
      handlePasswordRecovery,
      createAccount,
      isForgottenPassword,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      displayChoosedTrue,
      isCreateAccount,
      showIsForgottenPassword
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-modal__bar {
  font-size: 16px;
  font-weight: 500;
}
.additional-account {
  align-items: center;
  @include for-mobile {
    margin-top: 24px;
  }
  p {
    font-size: 16px;
    font-weight: 400;
    margin-left: 12px;
    margin-top: 3px;
  }
}
.modal::v-deep .sf-modal {
  &__container {
    @include for-desktop {
      width: 610px !important;
    }
    .sf-modal__content {
      padding: 40px 79px;
      @include for-mobile {
        padding: 40px 16px;
      }
    }
  }
}

.sf-button--outline {
  border-color: black;
}

.sign-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  @include for-mobile {
    font-size: 24px;
    text-align: left;
  }
}
.reset-pass-text {
  margin-bottom: var(--spacer-xl);
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 20px;
  @include for-mobile {
    text-align: left;
  }
}

.form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-md) 0;
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
}

.bottom {
  @include for-desktop {
    text-align: center;
  }
  .bottom-enjoy {
    font-size: 16px;
    font-weight: 400;
    margin-top: 24px;
    margin-bottom: 16px;
    color: #43464e;
  }
}
::v-deep .sf-loader {
  height: 19px;
  .sf-loader__overlay {
    background: #f1f2f3;
  }
}
</style>
