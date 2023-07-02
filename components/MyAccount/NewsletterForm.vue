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
      <div
        class="form flex-col xl:flex-row items-start xl:items-center gap-y-5 xl:gap-x-12 mb-10"
      >
        <p class="form__title m-0">{{ $t('Sections that interest you') }}</p>
        <slot name="form">
          <div class="form__checkbox-group mb-5 lg:m-0">
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

    const fillCheckedNewsletter = () => {
      checkedNewsletter.value = mailingContacts?.value?.map((item) => {
            return item.subscriptionList
      })?.flat()?.filter(item => {
        return item.optOut
      })?.map(item => `${item.mailingList.id}`)
    };

    onSSR(async () => {
      await getMailingLists();
      await getMailingContacts();
    });

    onMounted(async() => {
      fillCheckedNewsletter()
    });

    const handleUpdateNewsletter = async () => {
      const selectedItem = mailingList.value?.map(item => {
        return {
          mailinglistId: item.id,
          optout: checkedNewsletter.value?.includes(`${item.id}`)
        }
      })

      await userAddMultipleMailing(selectedItem);

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
