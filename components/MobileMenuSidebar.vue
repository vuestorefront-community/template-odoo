<template>
  <div id="mobileMenu">
    <SfSidebar
      :visible="isMobileMenuOpen"
      :button="false"
      :title="currentParentMenu"
      class="sidebar sf-sidebar--right"
    >
      <template #bar>
        <div class="sf-bar smartphone-only">
          <div>
            <button
              @click="backMenu"
              type="button"
              aria-label="back"
              class="sf-button--pure sf-bar__icon sf-button"
            >
              <SfIcon
                icon="chevron_left"
                size="xxs"
                color="gray-primary"
                viewBox="0 0 24 24"
                :coverage="1"
              />
            </button>
          </div>
          <div>
            <div class="sf-bar__title">{{ currentParentMenu }}</div>
          </div>
          <div>
            <button
              type="button"
              aria-label="close"
              class="display-none sf-button--pure sf-bar__icon sf-button"
            >
              <SfIcon
                icon="cross"
                size="xxs"
                color="gray-primary"
                viewBox="0 0 24 24"
                :coverage="1"
              />
            </button>
          </div>
        </div>
      </template>

      <template v-if="!isChildsOpened">
        <SfHeaderNavigationItem
          v-for="(category, index) in filteredTopCategories"
          :key="index"
          data-cy="app-header-top-categories"
          class="nav-item"
          :label="category.name"
          @click="openChilds(category.name, category.slug)"
        />
      </template>

      <SfLoader :class="{ loading }" :loading="loading">
        <SfAccordion showChevron transition="sf-expand" v-if="isChildsOpened">
          <SfAccordionItem
            v-for="(cat, i) in categoryTree.items"
            :key="i"
            :header="cat.label"
          >
            <template>
              <SfList class="list">
                <SfListItem
                  class="list__item"
                  v-for="(subCat, j) in cat.items"
                  :key="j"
                >
                  <SfMenuItem
                    :count="subCat.count || ''"
                    :data-cy="`category-link_subcategory_${subCat.slug}`"
                    :label="subCat.label"
                  >
                    <template #label="{ label }">
                      <a
                        @click="goToSubCategory(subCat)"
                        class="w-11/12 flex justify-items-start"
                        :class="subCat.isCurrent ? 'sidebar--cat-selected' : ''"
                      >
                        {{ label }}
                      </a>
                    </template>
                  </SfMenuItem>
                </SfListItem>
              </SfList>
            </template>
          </SfAccordionItem>
        </SfAccordion>
      </SfLoader>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfAccordion,
  SfLoader,
  SfList,
  SfMenuItem,
  SfIcon
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  ref,
  useRouter
} from '@nuxtjs/composition-api';
import {
  useUser,
  productGetters,
  useCategory,
  useFacet,
  facetGetters
} from '@vue-storefront/odoo';
import { onSSR } from '@vue-storefront/core';
import { useUiState, useUiHelpers } from '~/composables';

export default defineComponent({
  name: 'Wishlist',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfAccordion,
    SfLoader,
    SfList,
    SfMenuItem,
    SfIcon,
  },
  setup(_, {root}) {
    const isChildsOpened = ref(false);
    const currentParentMenu = ref('Menu');
    const router = useRouter();
    const { getCatLink, getFacetsFromURL } = useUiHelpers();
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();
    const { isAuthenticated } = useUser();
    const { categories: topCategories } = useCategory(
      'AppHeader:TopCategories'
    );

    const { result, loading, search } = useFacet();

    const categoryTree = computed(() =>
      facetGetters.getCategoryTree(result.value)
    );

    const filteredTopCategories = computed(() =>
      topCategories.value?.filter(
        (cat) => cat.name === 'WOMEN' || cat.name === 'MEN'
      )
    );

    const openChilds = async (menuName, slug) => {
      currentParentMenu.value = menuName;
      router.push(root.localePath(slug));
      const params = { ...getFacetsFromURL() };
      await search(params);
      isChildsOpened.value = true;
    };

    const backMenu = () => {
      if (isChildsOpened.value) {
        currentParentMenu.value = "Menu";
        isChildsOpened.value = false;
      } else {
        toggleMobileMenu();
        currentParentMenu.value = "Menu";
        isChildsOpened.value = false;
      }
    };

    const goToSubCategory = (subCategory) => {
      if (subCategory) {
        router.push(root.localePath(getCatLink(subCategory)));
      }
      toggleMobileMenu();
      currentParentMenu.value = 'Menu';
      isChildsOpened.value = false;
    };

    onSSR(async () => {});

    return {
      currentParentMenu,
      goToSubCategory,
      backMenu,
      isChildsOpened,
      openChilds,
      getCatLink,
      loading,
      categoryTree,
      filteredTopCategories,
      isAuthenticated,
      isMobileMenuOpen,
      toggleMobileMenu,
      productGetters
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/css/mobileMenuSideBar.scss';
</style>
