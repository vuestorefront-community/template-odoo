<script lang="ts" setup>
import { useCategory } from '@/composables';
import {
  SfAccordionItem,
  SfButton,
  SfChip,
  SfCounter,
  SfIconArrowBack,
  SfIconChevronLeft,
  SfIconCheck,
  SfListItem,
  SfRadio,
  SfSelect,
  SfThumbnail,
} from '@storefront-ui/vue';

const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const { loadCategoryList, getGrouped } = useCategory();

const { categories: categoryTree } = await loadCategoryList({
  filter: { parent: true },
});

const facets = computed(() => [
  {
    id: null,
    label: 'Price',
    type: 'price',
    options: [
      { id: 'pr1', label: 'Under $24.99', value: 'under' },
      { id: 'pr2', label: '$25.00 - $49.99', value: '25-49' },
      { id: 'pr3', label: '$50.00 - $99.99', value: '50-99' },
      { id: 'pr4', label: '$100.00 - $199.99', value: '100-199' },
      { id: 'pr5', label: '$200.00 and above', value: 'above' },
    ],
  },
  ...getGrouped(props.attributes, ['color', 'size', 'material']),
]);
const opened = ref<boolean[]>(facets.value.map(() => true));
const sortByAscendingProductAttributes = (data: any[]) => {
  return (
    data
      // eslint-disable-next-line func-names
      ?.sort(function (a: any, b: any) {
        const labelA = a.label;
        const labelB = b.label;
        if (labelA === labelB) {
          const lastCharA = labelA.charAt(labelA.length - 1);
          const lastCharB = labelB.charAt(labelB.length - 1);
          return lastCharA.localeCompare(lastCharB);
        } else {
          return labelA.localeCompare(labelB);
        }
      })
      ?.sort((a: { label: number }, b: { label: number }) => a.label - b.label)
  );
};

const getSortOptions = (searchData: { input: any }) => ({
  options: [
    {
      id: 'list_price desc',
      value: 'price,DESC',
      attrName: 'Price: High to Low',
      type: '',
    },
    {
      id: 'list_price asc',
      value: 'price,ASC',
      attrName: 'Price: Low to High',
      type: '',
    },
    { id: 'name asc', value: 'name,ASC', attrName: 'Name: A to Z', type: '' },
    {
      id: 'name desc',
      value: 'name,DESC',
      attrName: 'Name: Z to A',
      type: '',
    },
  ],
  selected: searchData.input.sort || 'name asc',
});
const changeSorting = (sort: string) => {
  router.push({ query: { ...route.query, sort } });
};
const sortBy = computed(() =>
  getSortOptions({ input: { sort: route.query?.sort } })
);

const parent = ref({
  name: 'All Products',
  href: '/',
  count: '1429',
});

const categories = ref([
  {
    name: 'New',
    href: '/',
    count: '29',
  },
  {
    name: 'Women',
    href: '/',
    count: '1921',
  },
  {
    name: 'Men',
    href: '/',
    count: '642',
  },
  {
    name: 'Accessories',
    href: '/',
    count: '29',
  },
  {
    name: 'Sale',
    href: '/',
    count: '29',
  },
]);
const selectedFilters = ref<string[]>([]);
const priceModel = ref('');

const isItemActive = (selectedValue: string) => {
  return selectedFilters.value?.includes(selectedValue);
};

onMounted(() => {
  console.log(facets.value);
});
</script>

<template>
  <aside class="w-full md:max-w-[376px]">
    <div
      class="py-2 px-4 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
      data-testid="category-tree"
    >
      {{ $t('category') }}
    </div>
    <div v-if="parent">
      <SfListItem
        size="lg"
        :class="[
          'md:sf-list-item-sm md:py-1.5 sf-list-item',
          {
            'bg-primary-100 hover:bg-primary-100 active:bg-primary-100 font-medium': false,
          },
        ]"
        data-testid="category-tree-item"
      >
        <NuxtLink :to="parent.href">
          <span class="flex gap-2 items-center">
            <span
              class="text-base md:text-sm capitalize flex items-center"
              data-testid="list-item-menu-label"
            >
              <SfIconArrowBack size="sm" class="text-neutral-500 mr-2" />
              {{ parent.name }}
            </span>
            <SfCounter v-if="Number(122) > -1" class="md:text-sm font-normal">{{
              parent.count
            }}</SfCounter>
          </span>
          <template #suffix>
            <SfIconCheck v-if="true" size="sm" class="text-primary-700" />
          </template>
        </NuxtLink>
      </SfListItem>
    </div>
    <ul class="mt-4 mb-6 md:mt-2" data-testid="categories">
      <SfListItem
        v-for="({ name, href, count }, index) in categories"
        :key="name"
        size="lg"
        :class="[
          'md:sf-list-item-sm md:py-1.5 sf-list-item',
          {
            'bg-primary-100 hover:bg-primary-100 active:bg-primary-100 font-medium':
              index === 0,
          },
        ]"
        data-testid="category-tree-item"
      >
        <NuxtLink :to="href">
          <span class="flex gap-2 items-center">
            <span
              class="text-base md:text-sm capitalize flex items-center"
              data-testid="list-item-menu-label"
            >
              <slot />
              {{ name }}
            </span>
            <SfCounter
              v-if="Number(count) > -1"
              class="md:text-sm font-normal"
              >{{ count }}</SfCounter
            >
          </span>
        </NuxtLink>
      </SfListItem>
    </ul>
    <h5
      class="py-2 px-4 mb-6 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Sort by
    </h5>
    <div class="px-2">
      <SfSelect
        v-model="sortBy.selected"
        placeholder="Select sorting"
        :aria-label="$t('sortBy')"
        @update:model-value="changeSorting"
      >
        <option
          v-for="{ id, value, attrName } in sortBy.options"
          :key="id"
          :value="value"
        >
          {{ attrName }}
        </option>
      </SfSelect>
    </div>
    <h5
      class="py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Filter
    </h5>
    <client-only>
      <ul>
        <li v-for="(facet, index) in facets" :key="index">
          <SfAccordionItem v-model="opened[index]">
            <template #summary>
              <div class="flex justify-between items-center p-2 mb-2">
                <p class="p-2 font-medium typography-headline-5">
                  {{ facet.label }}
                </p>
                <SfIconChevronLeft
                  :class="opened[index] ? 'rotate-90' : '-rotate-90'"
                />
              </div>
            </template>
            <template v-if="facet.type == 'price'">
              <fieldset id="radio-price">
                <SfListItem
                  v-for="{ id, value, label } in facet.options"
                  :key="id"
                  tag="label"
                  size="sm"
                  class="px-1.5 bg-transparent hover:bg-transparent"
                >
                  <template #prefix>
                    <SfRadio
                      v-model="priceModel"
                      class="flex items-center"
                      name="radio-price"
                      :value="value"
                      @click="priceModel = priceModel === value ? '' : value"
                    />
                  </template>
                  <p>
                    <span
                      :class="[
                        'text-sm mr-2',
                        { 'font-medium': priceModel === value },
                      ]"
                      >{{ label }}</span
                    >
                  </p>
                </SfListItem>
              </fieldset>
            </template>
            <ul
              v-if="facet.type === 'select'"
              class="grid grid-cols-5 gap-2 px-3"
            >
              <li
                v-for="{ id, value, label } in sortByAscendingProductAttributes(
                  facet.options
                )"
                :key="id"
              >
                <SfChip
                  v-model="selectedFilters"
                  class="w-full"
                  size="sm"
                  :input-props="{ value }"
                >
                  {{ label }}
                </SfChip>
              </li>
            </ul>
            <ul
              v-if="facet.type === 'radio'"
              class="grid grid-cols-3 gap-2 px-3"
            >
              <li v-for="{ id, value, label } in facet.options" :key="id">
                <SfChip
                  v-model="selectedFilters"
                  class="w-full"
                  size="sm"
                  :input-props="{ value }"
                >
                  {{ label }}
                </SfChip>
              </li>
            </ul>
            <template v-if="facet.type == 'color'">
              <SfListItem
                v-for="{ id, value, label, htmlColor } in facet.options"
                :key="id"
                size="sm"
                tag="label"
                :class="[
                  'px-4 bg-transparent hover:bg-transparent',
                  { 'font-medium': isItemActive(value) },
                ]"
                :selected="isItemActive(value)"
              >
                <template #prefix>
                  <input
                    v-model="selectedFilters"
                    :value="label"
                    class="appearance-none peer"
                    type="checkbox"
                  />
                  <span
                    class="inline-flex items-center justify-center p-1 transition duration-300 rounded-full cursor-pointer ring-1 ring-neutral-200 ring-inset outline-offset-2 outline-secondary-600 peer-checked:ring-2 peer-checked:ring-primary-700 peer-hover:bg-primary-100 peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 peer-disabled:cursor-not-allowed peer-disabled:bg-disabled-100 peer-disabled:opacity-50 peer-disabled:ring-1 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 peer-focus-visible:outline"
                    ><SfThumbnail
                      size="sm"
                      :style="{ backgroundColor: htmlColor }"
                  /></span>
                </template>
                <p>
                  <span class="mr-2 typography-text-sm">{{ label }}</span>
                </p>
              </SfListItem>
            </template>
          </SfAccordionItem>
          <hr class="my-4" />
        </li>
      </ul>
    </client-only>
    <div
      class="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between px-3 lg:px-0"
    >
      <SfButton variant="secondary" class="w-full mr-3" @click="">
        {{ $t('clearFilters') }}
      </SfButton>
      <SfButton class="w-full">{{ $t('showProducts') }}</SfButton>
    </div>
  </aside>
</template>
