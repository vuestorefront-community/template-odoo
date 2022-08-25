<template>
  <SfTabs
    :open-tab="1"
    class="sf-my-newsletter tab-orphan"
    tabMaxContentHeight="100%"
  >
    <SfTab :title="$t('My newsletter')" data-testid="newsletter-tab">
      <slot name="tab-description">
        <p class="message">
          {{ $t('Set up newsletter') }}
        </p>
      </slot>
      <div class="form">
        <p class="form__title">{{ $t('Sections that interest you') }}</p>
        <slot name="form">
          <div class="form__checkbox-group">
            <SfCheckbox
              v-for="(mailing, i) in mailingList"
              :key="mailing.id"
              v-model="checkedNewsletter"
              :label="$t(mailing.name)"
              :name="mailing.name"
              :value="String(mailing.id)"
              class="form__element"
            />
          </div>
        </slot>
        <slot name="form-button">
          <OdooButton
            @click="handleUpdateNewsletter"
            :loading="loading"
            :disabled="checkedNewsletter.length === 0 || loading"
          >
            {{ $t('Save changes') }}
          </OdooButton>
        </slot>
      </div>
      <slot name="notice">
        <p class="notice">
          {{ $t('I have read and understand the') }} <a href="#">{{ $t('Privacy') }}</a> {{ $t('and') }}
          <a href="#">{{ $t('Cookies Policy') }}</a> {{ $t('and agree to receive personalized commercial information from Brand name by email.') }}
        </p>
      </slot>
    </SfTab>
  </SfTabs>
</template>

<script type="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api';
import { SfCheckbox, SfTabs } from '@storefront-ui/vue';
import { onSSR } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';
import { useMailing } from '@vue-storefront/odoo';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default defineComponent({
  components: {
    SfTabs,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  setup(_, { root}) {
    const checkedNewsletter = ref([]);
    const { send } = useUiNotification();

    const {
      getMailingLists,
      mailingList,
      userAddMultipleMailing,
      loading,
      getMailingContacts,
      mailingContacts
    } = useMailing();

    const fillCheckedNewsletter = (subscribed) => {
      const subscribedMailings = subscribed.map((item) =>
        item.map((subItem) => subItem.mailingList)
      );
      checkedNewsletter.value = subscribedMailings
        ?.flat()
        .map((item) => String(item.id));
    };

    onSSR(async () => {
      await getMailingLists();
      await getMailingContacts();
    });

    onMounted(() => {
      fillCheckedNewsletter(
        mailingContacts?.value?.map((item) => item.subscriptionList)
      );
    });

    const handleUpdateNewsletter = async () => {
      await userAddMultipleMailing(
        checkedNewsletter.value.map((item) => ({
          mailinglistId: Number(item),
          optout: true
        }))
      );

      send({
        message: root.$t('Successfull update!'),
        type: 'success'
      });
    };

    return {
      loading,
      checkedNewsletter,
      handleUpdateNewsletter,
      mailingList
    };
  }
});
</script>

<style lang='scss' scoped>
@import '~@storefront-ui/shared/styles/components/templates/SfMyNewsletter.scss';
</style>
