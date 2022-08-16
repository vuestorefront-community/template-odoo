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
            @delete-address="deleteAddress"
          >
            <template #form>
              <ShippingAddressForm></ShippingAddressForm>
            </template>
          </SfShippingDetails>
        </SfContentPage>

        <SfContentPage title="Newsletter">
          <SfMyNewsletter />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory title="Order details">
        <SfContentPage title="Order history">
          <OrderHistory />
        </SfContentPage>
      </SfContentCategory>

      <SfContentPage title="Log out" />
    </SfContentPages>
  </div>
</template>

<script type="ts">
import {
  SfMyProfile,
  SfShippingDetails,
  SfMyNewsletter,
  SfOrderHistory,
  SfContentPages
} from '@storefront-ui/vue';
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
import { useUser, useUserShipping } from '@vue-storefront/odoo';
import { onSSR } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm.vue';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm.vue';
import OrderHistory from '~/components/MyAccount/OrderHistory.vue';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm.vue';

export default defineComponent({
  name: 'MyAccount',
  components: {
    SfContentPages,
    SfMyProfile,
    SfShippingDetails,
    SfMyNewsletter,
    SfOrderHistory,
    ProfileUpdateForm,
    PasswordResetForm,
    OrderHistory,
    ShippingAddressForm
},
  setup(props, { root }) {
    const activePage = ref('My profile');
    const { user, load: loadUser, logout } = useUser();
    const { shipping, load, addAddress, deleteAddress, updateAddress } = useUserShipping();
    const { send } = useUiNotification();

    onSSR(async () => {
      await loadUser();
      await load();
    });

    const account = computed(() => ({
      firstName: user?.value?.name?.split()?.[0] || '',
      lastName: user?.value?.name?.split()[user?.value?.name?.split()?.length - 1] || '',
      email: user?.value?.email || '',
      password: '',
      city: '',
      shipping: shipping.value || [],
      orders: []
    }));

    const handleUpdateAddress = (address, asa) => {
      console.log(address, asa);
    }

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
      handleUpdateAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      activePage,
      account,
      changeActivePage
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/css/account/myProfile.scss';
</style>
