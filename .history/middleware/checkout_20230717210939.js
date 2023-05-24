const canEnterShipping = (cart) => cart?.order?.orderLines?.length > 0 || false;

const canEnterBiling = (cart) => {
<<<<<<< HEAD
  const checkShippingAddress = cart?.order.partnerShipping.id && cart?.order.partnerShipping.street;
  return canEnterShipping(cart) && checkShippingAddress;
};

const canEnterPayment = (cart) => {
  const checkInvoiceAddress = cart?.order.partnerInvoice.id && cart?.order.partnerInvoice.street;
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress;
};
=======
  const checkShippingAddress = cart?.order.partnerShipping
  return canEnterShipping(cart) && checkShippingAddress.id && checkShippingAddress.street && checkShippingAddress.country
};

const canEnterPayment = (cart) => {
const checkInvoiceAddress = cart?.order.partnerInvoice
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress.id && checkInvoiceAddress.street && checkInvoiceAddress.country;
} 
>>>>>>> c999a7c (16038)

export default async ({ app, $vsf, redirect }) => {
export default async ({ app, $vsf, redirect }) => {
  const currentPath = app.context.route.fullPath.split('/checkout/')[1];

  if (!currentPath) return;

<<<<<<< HEAD
  const { data } = await $vsf.$odoo.api.redisSyncCartToOdoo();
  if (!data.cart) return;
=======
  const { data }  = await $vsf.$odoo.api.cartLoad();
  const { cart } = data
  if (!cart) return;
>>>>>>> c999a7c (16038)

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
