const canEnterShipping = (cart) => cart?.order.orderLines?.length > 0 || false;

const canEnterBiling = (cart) => {
  const checkShippingAddress = cart?.order.partnerShipping.id && cart?.order.partnerShipping.street
  return canEnterShipping(cart) && checkShippingAddress
};

const canEnterPayment = (cart) => {
const checkInvoiceAddress = cart?.order.partnerInvoice.id && cart?.order.partnerInvoice.street
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress;
} 

export default async ({ app, $vsf, redirect }) => {
  const currentPath = app.context.route.fullPath.split('/checkout/')[1];

  if (!currentPath) return;

  const { data }  = await $vsf.$odoo.api.cartLoad();
  const { cart } = data
  if (!cart) return;

  switch (currentPath) {
    case 'shipping':
      if (!canEnterShipping(cart)) {
        redirect('/cart');
      }
      break;
    case 'billing':
      if (!canEnterBiling(cart)) {
        redirect('/cart');
      }
      break;
    case 'payment':
      if (!canEnterPayment(cart)) {
        redirect('/cart');
      }
      break;
  }
};
