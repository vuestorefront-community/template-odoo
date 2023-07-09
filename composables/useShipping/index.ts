import { useCart } from '@vue-storefront/odoo';
import { useVSFContext } from '@vue-storefront/core';

const throwErrors = (errors: Array<{ message?: string }>) => {
  if (errors) {
    throw new Error(errors.map(error => error.message).join(',') || 'Some error');
  }
};

const useCustomShipping = (): any => {
  const context = useVSFContext();
  const cartContext = useCart();

  const saveShippingAddress = async (params) => {
    if ('id' in params && params.id) {
      try {
        const { data } = await context.$odoo.api.updateShippingAddress(params);
        cartContext.cart.value.order.partnerShipping = data.updateAddress
      } catch (errors) {
        throwErrors(errors);
      }
    } else {
      try {
        const { data } = await context.$odoo.api.addShippingAddress(params);
        cartContext.cart.value.order.partnerShipping = data.addAddress
      } catch (errors) {
        throwErrors(errors);
      }
    }
  };


  return {
    saveShippingAddress,
  };
};

export default useCustomShipping;
