<script setup lang="ts">
import { SfDrawer, SfButton, SfIconClose } from '@storefront-ui/vue';

export type CategorySidebarProps = {
  isOpen: boolean;
};
export type CategorySidebarEmits = (event: 'close') => void;

defineProps<CategorySidebarProps>();
defineEmits<CategorySidebarEmits>();
</script>

<template>
  <transition
    enter-active-class="transition duration-500 ease-in-out"
    leave-active-class="transition duration-500 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <SfDrawer
      v-show="isOpen"
      :model-value="true"
      :disable-click-away="true"
      :disable-esc="true"
      placement="right"
      class="shadow-none z-[100] w-full lg:w-[400px] bg-white"
      data-testid="category-sidebar"
    >
      <div class="flex flex-col h-full">
        <div class="p-4 flex justify-between items-center">
          <span class="font-bold text-lg text-black">Wishlist</span>
          <SfButton
            variant="tertiary"
            @click="$emit('close')"
            :aria-label="$t('closeListSettings')"
          >
            <template #prefix>
              <SfIconClose class="text-neutral-500" />
            </template>
          </SfButton>
        </div>
        <div>
          <div v-if="false" class="overflow-y-auto p-4 text-black">
            This is wishlist
          </div>
          <div
            v-else
            class="flex items-center justify-center flex-col pt-24 pb-32 text-black"
            data-testid="cart-page-content"
          >
            <NuxtImg
              src="/images/empty-cart.svg"
              :alt="$t('emptyCartImgAlt')"
              width="192"
              height="192"
            />
            <h2 class="mt-8">Your Wishlist is empty</h2>
          </div>
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>
