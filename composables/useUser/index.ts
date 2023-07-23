import { computed, watch } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { useUser as baseUseUser, useWishlist } from '@vue-storefront/odoo';
import useCart from '../useCart';

//@tutorial temporary composable to handle new behaviour of not loading user on ssr.
const useUser = () : any => {
  const context = useVSFContext();
  const { load : loadCart, setCart } = useCart();
  const { setWishlist, load : loadWishlist } = useWishlist();

  const { user, logout : baseLogout, setUser, login: baseLogin } = baseUseUser();

  const isAuthenticated = computed(() => {
    const cookie = context.$odoo.config.app.$cookies.get('odoo-user');
    
    return user.value?.id || !!cookie?.id
  })

  const logout = async () => {
    context.$odoo.config.app.$cookies.remove('odoo-user');
    context.$odoo.config.app.$cookies.remove('wishlist-size');
    setUser(null);
    setCart(null);
    setWishlist(null);
    await baseLogout()
    await loadCart()
    await loadWishlist()
  }

  const login = async (params: any & { customQuery }) => {
    const { customQuery } = params;

    await baseLogin(params);

    setCart(null);
    setWishlist(null);
    await loadCart()
    await loadWishlist()

    context.$odoo.config.app.$cookies.set('odoo-user', user?.value, { sameSite: true, path: '/' });
    return user?.value;
  }

  return {
    ...baseUseUser(),
    isAuthenticated,
    logout,
    login
  };
};

export default useUser;

