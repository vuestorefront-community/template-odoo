<template>
  <!-- TODO: create logic with isActive prop for BottomNavigationItems -->
  <SfBottomNavigation class="navigation-bottom smartphone-only">
    <SfBottomNavigationItem
      :class="route.path == '/' ? 'sf-bottom-navigation__item--active' : ''"
      icon="home"
      size="20px"
      label="Home"
      @click="handleHomeClick"
    />
    <SfBottomNavigationItem
      icon="menu"
      size="20px"
      label="Menu"
      @click="toggleMobileMenu"
    />
    <SfBottomNavigationItem
      :icon="accountIcon"
      size="20px"
      label="Account"
      @click="handleAccountClick"
    />
    <div class="wishlist-wrapper">
      <div class="relative">
        <SfBottomNavigationItem
          class="w-16"
          icon="heart"
          size="20px"
          label="Wishlist"
          @click="handleWishlistSideBarClick"
        />
        <SfBadge v-show="TotalWishlistItems" class="sf-badge--number wishlist-badge">
          {{ TotalWishlistItems }}
        </SfBadge>
     </div>
    </div>
    
    <!-- TODO: add logic for label - if on Home then Basket, if on PDC then AddToCart etc. -->
    <SfBottomNavigationItem
      label="Basket"
      icon="add_to_cart"
      @click="handleCartSideBarClick"
    >
      <template #icon>
        <SfCircleIcon class="cart-button" aria-label="Add to cart">
          <SfIcon
            icon="add_to_cart"
            color="white"
            size="25px"
            :style="{ margin: '0 0 0 -2px' }"
          />
          <SfBadge 
            :class="{ 'hidden': cartTotalItems == 0 }" 
            class="sf-badge--number cart-badge">{{
              cartTotalItems
            }}</SfBadge>
        </SfCircleIcon>
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import {
  SfBottomNavigation,
  SfIcon,
  SfCircleIcon,
  SfBadge
} from '@storefront-ui/vue';
import { useUiState, useCart } from '~/composables';
import { useUser, cartGetters, useWishlist, wishlistGetters } from '@vue-storefront/odoo';
import { computed, useRoute, useRouter } from '@nuxtjs/composition-api';

export default {
  components: {
    SfBottomNavigation,
    SfIcon,
    SfCircleIcon,
    SfBadge
  },
  setup(_, {root}) {
    const route = useRoute();
    const router = useRouter();
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      toggleMobileMenu,
      isMobileMenuOpen
    } = useUiState();
    const { load: loadUser, isAuthenticated: isLoggedIn } = useUser();
    const { load: loadCart, cartTotalItems } = useCart();
    const { load: loadWishlist, wishlist } = useWishlist();
    
    const isAuthenticated = computed(() => {
      return isLoggedIn.value
        ? isLoggedIn.value
        : root.$cookies.get("odoo-user");
    });

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        root.$cookies.remove('odoo-user');
        await loadUser();
        return router.push(root.localePath('/my-account'));
      }
      toggleLoginModal();
    };

    const handleHomeClick = () => {
      isMobileMenuOpen.value ? toggleMobileMenu() : false;
      router.push(root.localePath('/'));
    };

    const handleWishlistSideBarClick = async () => {
      await loadWishlist();
      toggleWishlistSidebar();
    };

    const handleCartSideBarClick = async () => {
      await loadCart();
      toggleCartSidebar();
    };

    const TotalWishlistItems = computed(() => {
      const count = wishlistGetters.getTotalItems(wishlist.value)
      return count ? count.toString() : root.$cookies.get('wishlist-size');
    });

    return {
      route,
      isMobileMenuOpen,
      toggleWishlistSidebar,
      accountIcon,
      toggleCartSidebar,
      toggleMobileMenu,
      cartTotalItems,
      handleAccountClick,
      handleHomeClick,
      TotalWishlistItems,
      handleWishlistSideBarClick,
      handleCartSideBarClick
    };
  }
};
</script>
<style lang="scss" scoped>
.navigation-bottom {
  --bottom-navigation-z-index: 3;
}
.wishlist-wrapper{
  width: 73px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (min-width: 410px) {
   .wishlist-wrapper {
     min-width: 85px;
   }
}
@media screen and (min-width: 600px) {
   .wishlist-wrapper {
     min-width: 150px;
   }
}
.wishlist-badge {
  position: absolute;
  top: 0;
  right: 10px;
}
.cart-button {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
