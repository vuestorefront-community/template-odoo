<script setup>
import { useMailing } from '@/composables';
import { SfCheckbox, SfButton } from '@storefront-ui/vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: 'account',
});
// const {
//   loading,
//   mailingList,
//   mailingContacts,
//   getMailingLists,
//   getMailingContacts,
//   userAddMultipleMailing,
// } = useMailing();
const toast = useToast();

const checkedNewsletter = ref([]);
const modelValue = ref([]);
const mailingLists = ref([
  { label: 'Newsletter' },
  { label: 'Imported contacts' },
]);

const fillCheckedNewsletter = () => {
  checkedNewsletter.value = mailingContacts?.value
    ?.map((item) => {
      return item.subscriptionList;
    })
    ?.flat()
    ?.filter((item) => {
      return item.optOut;
    })
    ?.map((item) => `${item.mailingList.id}`);
};

const handleUpdateNewsletter = async () => {
  const selectedItem = mailingList.value?.map((item) => {
    return {
      mailinglistId: item.id,
      optout: checkedNewsletter.value?.includes(`${item.id}`),
    };
  });
  await userAddMultipleMailing(selectedItem);
  toast.success('Successfully updated!');
};

onMounted(async () => {
  // await getMailingLists();
  // fillCheckedNewsletter();
});
</script>

<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <AccountProfileData class="col-span-3" header="My Subscription">
    <p>
      Set up your newsletter and we will send you information about new products
      and <br />
      trends from the sections you selected every week.
    </p>
    <div
      class="flex flex-col lg:flex-row gap-y-6 lg:gap-x-10 items-start lg:items-center pt-8 pb-2"
    >
      <p>Sections that interest you</p>
      <div class="flex flex-col gap-3">
        <div
          class="flex items-center"
          v-for="({ label }, index) in mailingLists"
          :key="index"
        >
          <SfCheckbox
            id="checkbox"
            v-model="modelValue"
            value="value"
            class-name="peer"
          />
          <label
            class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
            for="checkbox"
          >
            {{ label }}
          </label>
        </div>
      </div>

      <SfButton type="button" size="base">Save Changes</SfButton>
    </div>
  </AccountProfileData>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
</template>
