<template>
  <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-10" />
  <div
    :class="['mb-20 md:px-0', { 'px-4': !isRoot }]"
    data-testid="account-layout"
  >
    <h1
      v-if="isRoot || isTabletScreen"
      class="mt-4 mb-10 md:mb-10 mx-4 md:mx-0 font-bold typography-headline-3 md:typography-headline-2"
    >
      {{ $t('account.heading') }}
    </h1>
    <div v-else class="flex justify-between items-center mb-10 mt-4">
      <div v-for="({ subsections }, i) in sections" :key="i">
        <div
          v-for="{ label, link } in subsections"
          :key="label"
          class="font-bold typography-headline-3"
        >
          <h1 v-if="currentPath === link">{{ label }}</h1>
        </div>
      </div>
      <SfButton
        :tag="NuxtLink"
        to="/"
        class="flex md:hidden whitespace-nowrap"
        size="sm"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('account.back') }}
      </SfButton>
    </div>
    <div class="md:flex gap-10" data-testid="account-page-sidebar">
      <div
        :class="[
          'border-t md:border border-neutral-200 pt-4 pb-4 md:p-4 md:rounded-md min-w-[300px] md:block',
          { hidden: !isRoot },
        ]"
      >
        <ul
          class="[&:not(:last-child)]:mb-4"
          v-for="{ title, icon, subsections } in sections"
          :key="title"
        >
          <SfListItem
            class="py-4 md:py-2 hover:!bg-transparent font-medium !cursor-auto"
          >
            <template #prefix><component :is="icon" /></template>
            {{ title }}
          </SfListItem>
          <li v-for="{ label, link } in subsections" :key="label">
            <SfListItem
              :tag="NuxtLink"
              :to="link"
              :class="[
                'first-of-type:py-4 md:first-of-type:px-4 md:first-of-type:py-2 rounded-md active:bg-primary-100 !text-neutral-900',
                {
                  'font-medium bg-primary-100':
                    router.currentRoute.value.path === link,
                },
              ]"
            >
              <template #prefix><SfIconBase /></template>
              {{ label }}
              <template v-if="!isTabletScreen" #suffix
                ><SfIconChevronRight
              /></template>
            </SfListItem>
          </li>
        </ul>
        <UiDivider />
        <ul>
          <SfListItem
            :tag="NuxtLink"
            to="/"
            class="py-4 md:py-2 mt-4 rounded-md active:bg-primary-100 !text-neutral-900"
          >
            <template #prefix><SfIconBase /></template>
            {{ $t('account.logout') }}
          </SfListItem>
        </ul>
      </div>
      <div class="flex-1">
        <section
          class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
          data-testid="category-grid"
        >
          <slot />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  SfIconBase,
  SfIconPerson,
  SfIconShoppingCart,
  SfListItem,
  SfButton,
  SfIconArrowBack,
  SfIconChevronRight,
} from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';

const { t } = useI18n();
const router = useRouter();
const sections = [
  {
    title: t('account.accountSettings.heading'),
    icon: SfIconPerson,
    subsections: [
      {
        label: t('account.accountSettings.section.personalData'),
        link: '/my-account/personal-data',
      },
      {
        label: t('account.accountSettings.section.billingDetails'),
        link: '/my-account/billing-details',
      },
      {
        label: t('account.accountSettings.section.shippingDetails'),
        link: '/my-account/shipping-details',
      },
    ],
  },
  {
    title: t('account.ordersAndReturns.heading'),
    icon: SfIconShoppingCart,
    subsections: [
      {
        label: t('account.ordersAndReturns.section.myOrders'),
        link: '/my-account/my-orders',
      },
      {
        label: t('account.ordersAndReturns.section.returns'),
        link: '/my-account/returns',
      },
    ],
  },
];

const currentPath = computed(() => router.currentRoute.value.path);
const rootPathRegex = new RegExp(`^${'/my-account'}/?$`);
const isRoot = computed(() => rootPathRegex.test(currentPath.value));

const findCurrentPage = computed(() =>
  sections
    .flatMap(({ subsections }) => subsections)
    .find(({ link }) => currentPath.value.includes(link))
);

const breadcrumbs = computed(() => [
  { name: t('home'), link: '/' },
  { name: t('account.heading'), link: '/my-account' },
  ...(isRoot.value
    ? []
    : [{ name: findCurrentPage.value?.label, link: currentPath.value }]),
]);
const NuxtLink = resolveComponent('NuxtLink');
</script>
