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
      v-show="false"
      :model-value="true"
      :disable-click-away="true"
      :disable-esc="true"
      class="w-full shadow-none md:translate-x-0 z-[100] md:z-0 md:static md:!block -translate-x-full shrink-0 md:w-[303px] bg-white"
      data-testid="category-sidebar"
    >
      <div class="grid grid-rows-category-sidebar h-full md:block">
        <div class="p-4 flex justify-between items-center md:hidden">
          <span class="font-bold text-lg">{{ $t('listSettings') }}</span>
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
        <div class="overflow-y-auto md:overflow-y-visible py-4 md:p-0">
          <slot/>
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import { SfDrawer, SfButton, SfIconClose } from '@storefront-ui/vue';
</script>
