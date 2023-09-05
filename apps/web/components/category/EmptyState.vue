<script setup lang="ts"></script>
<template>
  <section>
    <div
      data-testid="category-empty-state"
      class="flex flex-col items-center md:mt-16"
    >
      <NuxtImg
        src="/images/something-went-wrong.svg"
        :alt="$t('emptyStateAltText')"
        width="300"
        height="300"
      />
      <p class="mt-8 font-medium">{{ $t('emptyStateText') }}</p>
    </div>
  </section>
</template>
