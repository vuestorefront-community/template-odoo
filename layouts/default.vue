<template>
  <div>
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <AppHeader />
    </LazyHydrate>
    <div>
      <div id="layout">
        <nuxt :key="$route.fullPath" />

        <MobileMenuSidebar :critical="false" />
        <LazyHydrate when-visible>
          <BottomNavigation />
        </LazyHydrate>
        <CartSidebar :critical="false" />
        <WishlistSidebar :critical="false" />
        <LoginModal :critical="false" />
        <Notification :critical="false" />
      </div>
      <LazyHydrate when-visible>
        <AppFooter />
      </LazyHydrate>
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';
import CartSidebar from '@/components/CartSidebar';
import WishlistSidebar from '@/components/WishlistSidebar';
import LoginModal from '@/components/LoginModal';
import MobileMenuSidebar from '@/components/MobileMenuSidebar';
import BottomNavigation from '@/components/BottomNavigation';

export default {
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    TopBar: () => import('@/components/TopBar'),
    AppHeader: () => import('@/components/AppHeader'),
    AppFooter: () => import('@/components/AppFooter'),
    Notification: () => import('@/components/Notification'),
    CartSidebar,
    WishlistSidebar,
    LoginModal,
    MobileMenuSidebar,
    BottomNavigation
  }
};
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: scroll;
  @include for-mobile {
    overflow: hidden;
  }
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
</style>
