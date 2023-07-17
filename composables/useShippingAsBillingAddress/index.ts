import { useCart } from '@vue-storefront/odoo';

const useShippingAsBillingAddress = (): any => {
  const cartContext = useCart();

  const use = async () => {
    const address = cartContext.cart.value.order.partnerShipping;
    return {
      ...address,
      country: { id: String(address.country?.id) },
      state: { id: String(address.state?.id) }
    };
  };

  return {
    use,
  };
};

export default useShippingAsBillingAddress;