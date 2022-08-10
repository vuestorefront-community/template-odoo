<template>
  <div id="my-account" class="my-account">
    <SfContentPages
      title="My Account"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory title="Personal Details">
        <!-- My profile page -->
        <SfContentPage title="My profile" data-testid="my-profile">
          <ProfileUpdateForm />
        </SfContentPage>

        <!-- Update password page -->
        <SfContentPage title="Update Password" data-testid="update-password">
          <PasswordResetForm />
        </SfContentPage>

        <!-- Shipping & Payment Details page -->
        <SfContentPage
          title="Shipping & Payment Details"
          data-testid="shipping-details"
        >
          <SfShippingDetails
            :account="account"
            data-testid="shipping-details-tabs"
            @update:shipping="account = { ...account, ...$event }"
          />
        </SfContentPage>

        <!-- Newsletter page -->
        <SfContentPage title="Newsletter">
          <SfMyNewsletter />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory title="Order details">
        <!-- Order history page -->
        <SfContentPage title="Order history">
          <SfOrderHistory :orders="account.orders" />
        </SfContentPage>

        <!-- My reviews page -->
        <SfContentPage title="My reviews">
          <!-- TODO: ADD MY REVIEWS PAGE -->
        </SfContentPage>
      </SfContentCategory>

      <!-- Log out -->
      <SfContentPage title="Log out" />
    </SfContentPages>
  </div>
</template>

<script type="module">
import {
  SfMyProfile,
  SfShippingDetails,
  SfMyNewsletter,
  SfOrderHistory,
  SfContentPages
} from '@storefront-ui/vue';
import { ref, reactive } from '@vue/composition-api';
import { useUser } from '@vue-storefront/odoo';
import { onSSR } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm.vue';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm.vue';

export default {
  name: 'my-profile',
  components: {
    SfContentPages,
    SfMyProfile,
    SfShippingDetails,
    SfMyNewsletter,
    SfOrderHistory,
    ProfileUpdateForm,
    PasswordResetForm
  },
  setup(props, { root }) {
    const activePage = ref('My profile');
    const account = reactive({});
    const { user, load: loadUser, logout } = useUser();
    const { send } = useUiNotification();

    const getAccountData = () => {
      account.value = {
        firstName: user ? user?.value.name.split()[0] : '',
        lastName: user
          ? user?.value.name.split()[user?.value.name.split().length - 1]
          : '',
        email: user ? user?.value.email : '',
        password: '',
        shipping: [],
        orders: []
      };
    };

    onSSR(async () => {
      await loadUser();
      getAccountData();
    });

    const changeActivePage = async (title) => {
      if (title === 'Log out') {
        send({
          message: 'You are logged out. We hope you come back soon mate!',
          type: 'info'
        });

        root.$router.push('/');
        await logout();

        return;
      }

      activePage.value = title;
    };

    return {
      activePage,
      account,
      changeActivePage
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
}
.my-account {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
      --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm)
      var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  padding: var(--spacer-base) 0 var(--spacer-lg);
  display: none;
}

::v-deep .my-account {
  margin-top: 40px;
}

::v-deep .my-account .sf-content-pages__sidebar {
  max-height: 550px;
  height: 100%;
  border-radius: 14px;
  max-width: 374px;
  overflow: hidden;
}

::v-deep .my-account .sf-content-pages__content {
  padding-left: 98px;
}

::v-deep .my-account .sf-tabs__title {
  padding-right: 10px;
  font-family: var(--font-family--primary);
}

::v-deep .my-account .sf-my-profile .message {
  color: #43464e;
}

::v-deep .sf-input__wrapper label {
  display: none;
}

::v-deep .my-account .sf-input input {
  padding-left: 5px;
  font-weight: 300;
  color: #43464e;
}

::v-deep .my-account .form__button {
  background: #32463d;
  color: #fff;
  font-family: var(--font-family--primary);
  max-width: 215px;
  width: 100%;
  text-align: center;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  padding-top: 20px;
}

::v-deep .my-account .notice {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
}

::v-deep .my-account .notice a {
  color: #0468db;
  text-decoration: underline;
  text-transform: uppercase;
  font-size: 14px;
}

::v-deep .sf-content-pages__category-title {
  display: none;
}

::v-deep .logout-btn button {
  color: red;
}

::v-deep .sf-content-pages__title {
  font-family: var(--font-family--primary);
  font-weight: 500;
  font-size: 26px;
}

::v-deep .sf-list .sf-list__item .sf-menu-item__label {
  font-family: var(--font-family--primary);
  font-weight: 500;
  font-size: 20px;
}

::v-deep .sf-content-pages__sidebar div:last-child {
  margin-top: 100px;
}

::v-deep .my-account .sf-content-pages__sidebar div:last-child span {
  color: #1d1f22;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: underline;
}
</style>
