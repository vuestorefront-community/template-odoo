const canEnterShipping = (cart) => cart?.order?.orderLines?.length > 0 || false;

const canEnterBiling = (cart) => {
  const checkShippingAddress = cart?.order.partnerShipping.id && cart?.order.partnerShipping.street;
  return canEnterShipping(cart) && checkShippingAddress;
};

const canEnterPayment = (cart) => {
  const checkInvoiceAddress = cart?.order.partnerInvoice.id && cart?.order.partnerInvoice.street;
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress;
};

export default async ({ app, $vsf, redirect }) => {
export default async ({ app, $vsf, redirect }) => {
  const currentPath = app.context.route.fullPath.split('/checkout/')[1];

  if (!currentPath) return;

  const { data } = await $vsf.$odoo.api.redisSyncCartToOdoo();
  if (!data.cart) return;

  switch (currentPath) {
    case 'shipping':
      if (!canEnterShipping(data.cart)) {
        redirect('/');
      }
      break;
    case 'billing':
      if (!canEnterBiling(data.cart)) {
        redirect('/');
      }
      break;
    case 'payment':
      if (!canEnterPayment(data.cart)) {
        redirect('/');
      }
      break;
  }
};
