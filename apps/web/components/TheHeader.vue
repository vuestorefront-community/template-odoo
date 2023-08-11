<script setup lang="ts">
import {
  SfBadge,
  SfButton,
  SfIconExpandMore,
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconClose,
  SfIconSearch,
  SfInput,
  SfIconCancel,
  SfIconPerson,
  SfDropdown,
  SfListItem,
  SfModal,
  useDisclosure,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';

defineProps<{
  filled?: boolean;
}>();

const { open } = useDisclosure();

const inputModel = ref('');
const inputReference = ref<HTMLSpanElement>();
const handleInputFocus = () => {
  const inputElement = unrefElement(inputReference)?.querySelector('input');
  inputElement?.focus();
};
const handleReset = () => {
  inputModel.value = '';
  handleInputFocus();
};
const handleSubmit = () => {
  handleReset();
};

watch(inputModel, () => {
  if (inputModel.value === '') {
    handleReset();
  }
});

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } =
  useDisclosure();
const {
  isOpen: isSearchModalOpen,
  open: searchModalOpen,
  close: searchModalClose,
} = useDisclosure();

const NuxtLink = resolveComponent('NuxtLink');
const cartLineItemsCount = 3;

const accountDropdown = [
  {
    label: 'My Account',
    link: '/my-account',
  },
  {
    label: 'My Orders',
    link: '//my-account/my-orders',
  },
  {
    label: 'Returns',
    link: '//my-account/returns',
  },
  {
    label: 'Logout',
    link: '/',
  },
];
</script>

<template>
  <header
    :class="[
      'h-14 md:h-20 flex z-50 md:sticky md:top-0 md:shadow-md',
      { 'bg-primary-700 text-white': filled },
      { 'bg-white text-[#02C652] border-b border-neutral-200': !filled },
    ]"
    data-testid="navbar-top"
  >
    <div
      class="flex gap-[clamp(1rem,3vw,3rem)] items-center w-full narrow-container sticky top-0 justify-between md:justify-normal"
    >
      <NuxtLink to="/" aria-label="Sf Homepage" class="h-6 md:h-7 -mt-1.5">
        <VsfLogo />
      </NuxtLink>
      <SfButton
        v-if="filled"
        class="!px-2 mr-auto hidden lg:flex text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900"
        type="button"
        variant="tertiary"
        :tag="NuxtLink"
        to="/category/1"
      >
        <template #suffix>
          <SfIconExpandMore class="hidden lg:block" />
        </template>
        <span class="hidden lg:flex whitespace-nowrap">{{
          $t('allProductsLinkText')
        }}</span>
      </SfButton>
      <div v-if="filled" class="hidden md:block flex-1">
        <form
          ref="referenceRef"
          role="search"
          class="relative"
          @submit.prevent="handleSubmit"
        >
          <SfInput
            ref="inputReference"
            v-model="inputModel"
            aria-label="Search"
            placeholder="Search"
            @focus="open"
          >
            <template #prefix>
              <SfIconSearch />
            </template>
            <template #suffix>
              <button
                v-if="inputModel"
                type="button"
                aria-label="Reset search"
                class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
                @click="handleReset"
              >
                <SfIconCancel />
              </button>
            </template>
          </SfInput>
        </form>
      </div>
      <nav v-if="filled" class="hidden md:flex md:flex-row md:flex-nowrap">
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          :tag="NuxtLink"
          to="/"
          :aria-label="$t('numberInCart', cartLineItemsCount)"
          variant="tertiary"
          square
        >
          <template #prefix>
            <SfIconFavorite />
            <SfBadge
              :content="cartLineItemsCount"
              class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
              data-testid="cart-badge"
            />
          </template>
        </SfButton>
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 ml-3 rounded-md"
          :tag="NuxtLink"
          to="/"
          :aria-label="$t('numberInCart', cartLineItemsCount)"
          variant="tertiary"
          square
        >
          <template #prefix>
            <SfIconShoppingCart />
            <SfBadge
              :content="cartLineItemsCount"
              class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
              data-testid="cart-badge"
            />
          </template>
        </SfButton>
        <SfDropdown v-model="isAccountDropdownOpen" placement="bottom-end">
          <template #trigger>
            <SfButton
              variant="tertiary"
              class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
              :class="{ 'bg-primary-900': isAccountDropdownOpen }"
              @click="accountDropdownToggle()"
            >
              <template #prefix><SfIconPerson /></template>
              Mahade
            </SfButton>
          </template>
          <ul
            class="rounded bg-white shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2"
          >
            <li v-for="{ label, link } in accountDropdown" :key="label">
              <template v-if="label === 'account.logout'">
                <UiDivider class="my-2" />
                <SfListItem
                  tag="button"
                  class="text-left"
                  @click="accountDropdownToggle()"
                  >{{ $t(label) }}</SfListItem
                >
              </template>
              <SfListItem
                v-else
                :tag="NuxtLink"
                :to="link"
                :class="{ 'bg-neutral-200': $route.path === link }"
              >
                {{ $t(label) }}
              </SfListItem>
            </li>
          </ul>
        </SfDropdown>
      </nav>
      <SfButton
        v-if="filled"
        variant="tertiary"
        class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
        square
        @click="searchModalOpen"
      >
        <SfIconSearch />
      </SfButton>
    </div>
  </header>
</template>
