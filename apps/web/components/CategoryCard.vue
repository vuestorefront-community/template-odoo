<script setup lang="ts">
const items = ref([
  {
    name: 'New',
    slug: '/',
    image: '/images/new-card.png',
  },
  {
    name: 'Men',
    slug: '/',
    image: '/images/men-card.png',
  },
  {
    name: 'Women',
    slug: '/',
    image: '/images/women-card.png',
  },
]);
</script>

<template>
  <h2
    class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2"
  >
    Shop by category
  </h2>
  <div
    class="md:px-6 mb-10 flex flex-nowrap md:flex-wrap md:justify-center overflow-x-scroll scrollbar-hidden"
    data-testid="category-card"
  >
    <div v-for="item in items" :key="item.name" class="mr-2 md:mr-6 group">
      <NuxtLink
        :to="item.slug"
        class="w-full h-full z-1 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
        :aria-label="item.name"
      >
        <div
          class="relative h-[240px] w-[240px] rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
        >
          <NuxtImg
            :src="item.image"
            :alt="item.name"
            width="240"
            height="240"
            loading="lazy"
            format="webp"
          />
        </div>
        <div class="flex justify-center">
          <p
            class="mt-4 font-semibold no-underline text-normal-900 typography-text-base group-hover:underline group-hover:text-primary-800 group-hover:font-normal group-active:text-primary-800 group-active:font-normal"
          >
            {{ item.name }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
