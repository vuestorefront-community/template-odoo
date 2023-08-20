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

const route = useRoute();
const router = useRouter();
const { loadCategoryList } = useCategory();

const {categories: categoryTree} = await loadCategoryList({ filter: { parent: true } });

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

type FilterDetail = {
  id: string;
  label: string;
  value: string;
  counter?: number;
  link?: string;
};

type Node = {
  id: string;
  summary: string;
  type: string;
  details: FilterDetail[];
};

const filtersData = ref<Node[]>([
  {
    id: 'acc1',
    summary: 'Size',
    type: 'size',
    details: [
      { id: 's1', label: '6', value: '6', counter: 10 },
      { id: 's2', label: '6.5', value: '6.5', counter: 10 },
      { id: 's3', label: '7', value: '7.5', counter: 30 },
      { id: 's4', label: '8', value: '8', counter: 0 },
      { id: 's5', label: '8.5', value: '8.5', counter: 3 },
      { id: 's6', label: '9', value: '9', counter: 7 },
      { id: 's7', label: '9.5', value: '9.5', counter: 9 },
      { id: 's8', label: '10', value: '10', counter: 11 },
      { id: 's9', label: '10.5', value: '10.5', counter: 12 },
      { id: 's10', label: '11', value: '11', counter: 0 },
      { id: 's11', label: '11.5', value: '11.5', counter: 4 },
      { id: 's12', label: '12', value: '12', counter: 1 },
    ],
  },
  {
    id: 'acc3',
    summary: 'Color',
    type: 'color',
    details: [
      {
        id: 'c1',
        label: 'Primary',
        value: 'bg-primary-500',
        counter: 10,
      },
      {
        id: 'c2',
        label: 'Black and gray',
        value: 'bg-[linear-gradient(-45deg,#000_50%,#d1d5db_50%)]',
        counter: 5,
      },
      {
        id: 'c3',
        label: 'Violet',
        value: 'bg-violet-500',
        counter: 0,
      },
      {
        id: 'c4',
        label: 'Red',
        value: 'bg-red-500',
        counter: 2,
      },
      {
        id: 'c5',
        label: 'Yellow',
        value: 'bg-yellow-500',
        counter: 100,
      },
      {
        id: 'c6',
        label: 'Avocado',
        value: 'bg-gradient-to-tr from-yellow-300 to-primary-500',
        counter: 14,
      },
    ],
  },
  {
    id: 'acc5',
    summary: 'Price',
    type: 'radio',
    details: [
      { id: 'pr1', label: 'Under $24.99', value: 'under', counter: 123 },
      { id: 'pr2', label: '$25.00 - $49.99', value: '25-49', counter: 100 },
      { id: 'pr3', label: '$50.00 - $99.99', value: '50-99', counter: 12 },
      { id: 'pr4', label: '$100.00 - $199.99', value: '100-199', counter: 3 },
      { id: 'pr5', label: '$200.00 and above', value: 'above', counter: 18 },
    ],
  },
]);

const selectedFilters = ref<string[]>([]);
const opened = ref<boolean[]>(filtersData.value.map(() => true));
const priceModel = ref('');
const ratingsModel = ref('');

const isItemActive = (selectedValue: string) => {
  return selectedFilters.value?.includes(selectedValue);
};
const handleClearFilters = () => {
  selectedFilters.value = [];
  priceModel.value = '';
  ratingsModel.value = '';
};
onMounted(() => {});
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
        <li
          v-for="(
            { id: filterDataId, type, summary, details }, index
          ) in filtersData"
          :key="filterDataId"
        >
          <SfAccordionItem v-model="opened[index]">
            <template #summary>
              <div class="flex justify-between items-center p-2 mb-2">
                <p class="p-2 font-medium typography-headline-5">
                  {{ summary }}
                </p>
                <SfIconChevronLeft
                  :class="opened[index] ? 'rotate-90' : '-rotate-90'"
                />
              </div>
            </template>
            <ul v-if="type === 'size'" class="grid grid-cols-5 gap-2 px-3">
              <li v-for="{ id, value, counter, label } in details" :key="id">
                <SfChip
                  v-model="selectedFilters"
                  class="w-full"
                  size="sm"
                  :input-props="{ value, disabled: !counter }"
                >
                  {{ label }}
                </SfChip>
              </li>
            </ul>
            <template v-if="type === 'color'">
              <SfListItem
                v-for="{ id, value, label, counter } in details"
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
                    :value="value"
                    class="appearance-none peer"
                    type="checkbox"
                  />
                  <span
                    class="inline-flex items-center justify-center p-1 transition duration-300 rounded-full cursor-pointer ring-1 ring-neutral-200 ring-inset outline-offset-2 outline-secondary-600 peer-checked:ring-2 peer-checked:ring-primary-700 peer-hover:bg-primary-100 peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 peer-disabled:cursor-not-allowed peer-disabled:bg-disabled-100 peer-disabled:opacity-50 peer-disabled:ring-1 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 peer-focus-visible:outline"
                    ><SfThumbnail size="sm" :class="value"
                  /></span>
                </template>
                <p>
                  <span class="mr-2 typography-text-sm">{{ label }}</span>
                  <SfCounter size="sm">{{ counter }}</SfCounter>
                </p>
              </SfListItem>
            </template>
            <template v-if="type === 'radio'">
              <fieldset id="radio-price">
                <SfListItem
                  v-for="{ id, value, label, counter } in details"
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
                    <SfCounter size="sm">{{ counter }}</SfCounter>
                  </p>
                </SfListItem>
              </fieldset>
            </template>
          </SfAccordionItem>
          <hr class="my-4" />
        </li>
      </ul>
    </client-only>
    <div
      class="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between px-3 lg:px-0"
    >
      <SfButton
        variant="secondary"
        class="w-full mr-3"
        @click="handleClearFilters()"
      >
        {{ $t('clearFilters') }}
      </SfButton>
      <SfButton class="w-full">{{ $t('showProducts') }}</SfButton>
    </div>
  </aside>
</template>
