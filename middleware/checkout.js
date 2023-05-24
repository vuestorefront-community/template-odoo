const canEnterShipping = (cart) => cart?.order.orderLines?.length > 0 || false;

const canEnterBiling = (cart) => {
  const checkShippingAddress = cart?.order.partnerShipping
  return canEnterShipping(cart) && checkShippingAddress.id && checkShippingAddress.street && checkShippingAddress.country
};

const canEnterPayment = (cart) => {
const checkInvoiceAddress = cart?.order.partnerInvoice
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress.id && checkInvoiceAddress.street && checkInvoiceAddress.country;
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
        redirect('/');
      }
      break;
    case 'billing':
      if (!canEnterBiling(cart)) {
        redirect('/');
      }
      break;
    case 'payment':
      if (!canEnterPayment(cart)) {
        redirect('/');
      }
      break;
  }
};
