import { computed, watch } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { useUser as baseUseUser } from '@vue-storefront/odoo';
import { AgnosticUser } from '@vue-storefront/odoo-api';
import useCart from '../useCart';

//@tutorial temporary composable to handle new behaviour of not loading user on ssr.
const useUser = () : any => {
  const context = useVSFContext();
  const { load : loadCart, setCart} = useCart();

  const { user, logout : baseLogout, setUser, load: loadUser } = baseUseUser();

  watch(() => user.value, 
  async () => {
    console.log(user.value);
    
  })

  const isAuthenticated = computed(() => {
    const cookie = context.$odoo.config.app.$cookies.get('odoo-user');
    
    return user.value?.id || !!cookie?.id
  })

  const logout = async () => {
    context.$odoo.config.app.$cookies.remove('odoo-user');
    setUser(null);
    setCart(null);
    await baseLogout()
    await loadCart()
  }

  const logIn = async (params: AgnosticUser & { customQuery }) => {
    const { customQuery } = params;

    const { data, errors } = await context.$odoo.api.logInUser(params, customQuery);

    context.$odoo.config.app.$cookies.set('odoo-user', data?.login?.partner, { sameSite: true, path: '/' });
    return data?.login?.partner;
  }

  return {
    ...baseUseUser(),
    isAuthenticated,
    logout,
    logIn
  };
};

export default useUser;

