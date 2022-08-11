<template>
  <div id="my-account" class="my-account">
    <SfContentPages
      title="My Account"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory title="Personal Details">
        <SfContentPage title="My profile" data-testid="my-profile">
          <ProfileUpdateForm />
        </SfContentPage>

        <SfContentPage title="Update Password" data-testid="update-password">
          <PasswordResetForm />
        </SfContentPage>

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

        <SfContentPage title="Newsletter">
          <SfMyNewsletter />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory title="Order details">
        <SfContentPage title="Order history">
          <SfOrderHistory :orders="account.orders" />
        </SfContentPage>

        <SfContentPage title="My reviews">
        </SfContentPage>
      </SfContentCategory>

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
@import '~/assets/css/account/myProfile.scss';
</style>
