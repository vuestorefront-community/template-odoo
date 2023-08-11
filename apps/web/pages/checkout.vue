<script setup lang="ts">
import {
  SfButton,
  SfIconArrowBack,
  SfLoaderCircular,
} from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');

defineProps<{
  backLabelDesktop: string;
  backLabelMobile: string;
  backHref: string;
  heading: string;
}>();

const isLoading = false;
</script>

<template>
  <div class="px-4 md:px-0 mb-20">
    <div class="flex justify-between mt-8 mb-10 px-4 md:px-0">
      <h1 class="font-bold typography-headline-3 md:typography-headline-2">
        checkout
      </h1>
      <SfButton
        :tag="NuxtLink"
        :to="backHref"
        class="flex md:hidden whitespace-nowrap"
        size="sm"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('back') }}
      </SfButton>
      <SfButton
        :tag="NuxtLink"
        :to="backHref"
        class="hidden md:flex"
        variant="tertiary"
      >
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ $t('backToCart') }}
      </SfButton>
    </div>
    <span class="!flex justify-center my-40 h-24" v-if="isLoading">
      <SfLoaderCircular size="3xl" />
    </span>
    <div v-else ></div>
  </div>
</template>
