<template>
  <div id="my-account" class="my-account">
    <SfContentPages
      :title="$t('My Account')"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory title="Personal Details">
        <SfContentPage :title="$t('My profile')" data-testid="my-profile">
          <ProfileUpdateForm />
        </SfContentPage>

        <SfContentPage
          :title="$t('Update Password')"
          data-testid="update-password"
        >
          <PasswordResetForm />
        </SfContentPage>

        <SfContentPage
          :title="$t('Shipping & Payment Details')"
          data-testid="shipping-details"
        >
          <SfTabs
            key="edit-address"
            :open-tab="1"
            class="tab-orphan"
            data-testid="shipping-details-tabs"
          >
            <SfTab :title="$t('Edit Address')" v-if="state === 'edit'">
              <ShippingAddressForm
                @cancel="handleCancelEditing"
                @save="handleSaveAddress"
                :address="addressToUpdate"
                :isNew="!addressToUpdate.id"
              ></ShippingAddressForm>
            </SfTab>

            <SfTab :title="$t('Shipping Addresses')" v-if="state === 'list'">
              <ShippingList
                :addresses="shipping"
                @change="handleChangeAddress"
                key="shipping-list"
              />

              <OdooButton
                class="action-button"
                data-testid="add-new-address"
                @click="handleAddNewAddress"
              >
                {{ $t('Add New Address') }}</OdooButton
              >
            </SfTab>
          </SfTabs>
        </SfContentPage>

        <SfContentPage :title="$t('Newsletter')">
          <NewsletterForm />
        </SfContentPage>
      </SfContentCategory>

      <SfContentCategory :title="$t('Order details')">
        <SfContentPage :title="$t('Order history')">
          <OrderHistory />
        </SfContentPage>
      </SfContentCategory>

      <SfContentPage :title="$t('Log out')" />
    </SfContentPages>
  </div>
</template>

<script lang="ts">
import {
  SfMyProfile,
  SfShippingDetails,
  SfMyNewsletter,
  SfOrderHistory,
  SfContentPages,
  SfTabs
} from '@storefront-ui/vue';
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
import { useUser, useUserShipping } from '@vue-storefront/odoo';
import { onSSR } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm.vue';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm.vue';
import OrderHistory from '~/components/MyAccount/OrderHistory.vue';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm.vue';
import ShippingList from '~/components/MyAccount/ShippingList.vue';
import NewsletterForm from '~/components/MyAccount/NewsletterForm.vue';

export default defineComponent({
  name: 'MyAccount',
  middleware: 'auth',
  components: {
    SfContentPages,
    SfMyProfile,
    SfTabs,
    SfShippingDetails,
    SfMyNewsletter,
    SfOrderHistory,
    ProfileUpdateForm,
    PasswordResetForm,
    OrderHistory,
    ShippingAddressForm,
    ShippingList,
    NewsletterForm
  },
  setup(props, { root }) {
    const activePage = ref('My profile');
    const state = ref('list');
    const addressToUpdate = ref({});
    const shippingDetails = ref(null);
    const { user, load: loadUser, logout } = useUser();
    const { shipping, load, addAddress, updateAddress } = useUserShipping();
    const { send } = useUiNotification();

    onSSR(async () => {
      await loadUser();
      await load();
    });

    const account = computed(() => ({
      firstName: user?.value?.name?.split(' ')?.[0] || '',
      lastName:
        user?.value?.name?.split(' ')[
          user?.value?.name?.split(' ')?.length - 1
        ] || '',
      email: user?.value?.email || '',
      password: '',
      city: '',
      shipping: shipping?.value,
      orders: []
    }));

    const handleCancelEditing = () => {
      state.value = 'list';
    };

    const handleAddNewAddress = () => {
      addressToUpdate.value = {};
      state.value = 'edit';
    };

    const handleSaveAddress = async () => {
      send({
        message: 'Succefully saved!',
        type: 'success'
      });
      handleCancelEditing();
      await load();
    };

    const handleChangeAddress = (shipping) => {
      addressToUpdate.value = shipping;
      state.value = 'edit';
    };

    const changeActivePage = async (title) => {
      if (title === root.$t('Log out')) {
        send({
          message: 'You are logged out. We hope you come back soon mate!',
          type: 'info'
        });

        root.$router.push(root.localePath('/'));
        await logout();

        return;
      }

      activePage.value = title;
    };

    return {
      handleAddNewAddress,
      handleChangeAddress,
      handleSaveAddress,
      handleCancelEditing,
      shippingDetails,
      addAddress,
      updateAddress,
      activePage,
      account,
      shipping,
      changeActivePage,
      addressToUpdate,
      state
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/css/account/myProfile.scss';
</style>
