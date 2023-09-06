<script setup lang="ts">
import { OrderLine } from '@erpgap/odoo-sdk-api-client';
import { SfLink, SfIconSell } from '@storefront-ui/vue';
import {
  useCart
} from '@/composables';

const { cartRemove } = useCart();

const NuxtLink = resolveComponent('NuxtLink');

defineProps({
  id: {
    type: Number,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  attributes: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  listPrice: {
    type: Number,
    required: true,
  },
  minValue: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

const handleRemoveFromCart = async (id: any) => {
  const response = await cartRemove(id);
};

</script>

<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
      <SfLink :tag="NuxtLink" :href="`${slug}`">
        <NuxtImg
          class="w-full h-auto border rounded-md border-neutral-200"
          :src="imageUrl ?? '/images/product.webp'"
          :alt="imageAlt ?? ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
      <div
        class="absolute top-0 left-0 text-white bg-secondary-600 py-1 pl-1.5 pr-2 text-xs font-medium"
      >
        <SfIconSell size="xs" class="mr-1" />
        {{ $t('sale') }}
      </div>
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <SfLink
        :href="slug"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ displayName }}
      </SfLink>
      <div class="my-2 sm:mb-0">
        <ul
          class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700"
        >
          <li v-for="attribute in attributes" :key="attribute.name">
            <span class="mr-1">{{ attribute.name }}:</span>
            <span class="font-medium">{{ attribute.label }}</span>
          </li>
        </ul>
      </div>
      <div
        class="items-start sm:items-center sm:mt-auto flex flex-col sm:flex-row"
      >
        <span
          v-if="listPrice"
          class="text-secondary-700 sm:order-1 font-bold typography-text-sm sm:typography-text-lg sm:ml-auto"
        >
          ${{ price }}
          <span
            class="text-neutral-500 ml-2 line-through typography-text-xs sm:typography-text-sm font-normal"
          >
            ${{listPrice  }}
          </span>
        </span>
        <span
          v-else
          class="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg"
        >
          ${{ price }}
        </span>
        <UiQuantitySelector
          :min-value="minValue"
          :max-value="maxValue"
          class="mt-4 sm:mt-0"
        />
        <button @click="handleRemoveFromCart(id)" type="button" class="ml-4 font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
      </div>
    </div>
  </div>
</template>
